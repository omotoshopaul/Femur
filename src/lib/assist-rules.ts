/**
 * FEMUR — Assist Automated Rules Engine
 * Evaluates hospital-submitted admission records against verified criteria.
 */

import type {
  CaseDoc,
  HospitalAdmissionRecord,
  EvaluationResult,
  EvaluationCheck,
} from '../types/assist.ts';
import type { OrganizationDoc, UserDoc } from '../types/auth.ts';

export const ASSIST_CONFIG = {
  MAX_GOAL_KOBO: 500_000_000, // 5,000,000 NGN in kobo
  MAX_ADMISSION_AGE_DAYS: 14,
  NAME_MATCH_THRESHOLD: 0.8,
  ACCOUNT_NAME_THRESHOLD: 0.7,
};

/**
 * Token-based Jaccard / Sørensen-Dice similarity score between two strings
 */
export function calculateTokenSimilarity(strA: string, strB: string): number {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const tokensA = new Set(normalize(strA));
  const tokensB = new Set(normalize(strB));

  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  if (tokensA.size === 0 || tokensB.size === 0) return 0.0;

  let intersectionCount = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) {
      intersectionCount++;
    }
  }

  // Token Dice similarity: 2 * |A ∩ B| / (|A| + |B|)
  return (2 * intersectionCount) / (tokensA.size + tokensB.size);
}

/**
 * Pure evaluation function for case records.
 * Returns decision ('live' | 'needs_review' | 'rejected') and check details.
 */
export function evaluateCase(
  caseDoc: CaseDoc,
  record: HospitalAdmissionRecord,
  submittingUser: Pick<UserDoc, 'role' | 'verificationStatus' | 'organizationId'>,
  hospitalOrg: Pick<OrganizationDoc, 'verificationStatus' | 'name'>,
  existingActiveCampaigns: { patientName: string; hospitalOrgId: string }[] = [],
  config = ASSIST_CONFIG
): EvaluationResult {
  const checks: EvaluationCheck[] = [];

  // Check 1: Submitting user has role hospital, is approved, and belongs to the case hospital
  const userRoleValid =
    submittingUser.role === 'hospital' &&
    submittingUser.verificationStatus === 'approved' &&
    submittingUser.organizationId === caseDoc.hospitalOrgId;

  checks.push({
    id: 'user_auth_and_affiliation',
    label: 'Clinician hospital affiliation & accreditation',
    passed: userRoleValid,
    reason: userRoleValid
      ? 'Submitting clinician is verified and active at this facility.'
      : 'Clinician is not an approved staff member of the admitting hospital.',
    isHardFailure: true,
  });

  // Check 2: Organization is approved
  const orgApproved = hospitalOrg.verificationStatus === 'approved';
  checks.push({
    id: 'hospital_accreditation',
    label: 'Hospital operational status',
    passed: orgApproved,
    reason: orgApproved
      ? 'Healthcare facility holds active verified accreditation.'
      : 'Facility is pending documentation or not accredited.',
    isHardFailure: true,
  });

  // Check 3: Patient name similarity
  const patientSimilarity = calculateTokenSimilarity(
    caseDoc.patientNameClaimed,
    record.patientName
  );
  const patientNameMatches = patientSimilarity >= config.NAME_MATCH_THRESHOLD;
  checks.push({
    id: 'patient_name_match',
    label: 'Patient clinical identity match',
    passed: patientNameMatches,
    reason: patientNameMatches
      ? `Name match confidence is ${Math.round(patientSimilarity * 100)}%.`
      : `Claimed name "${caseDoc.patientNameClaimed}" differs from admission record "${record.patientName}" (${Math.round(patientSimilarity * 100)}% match).`,
  });

  // Check 4: Admission date is not in future and not older than MAX_ADMISSION_AGE_DAYS
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const admissionDate = new Date(record.admissionDate);
  admissionDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - admissionDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isFuture = diffDays < 0;
  const isTooOld = diffDays > config.MAX_ADMISSION_AGE_DAYS;
  const admissionValid = !isFuture && !isTooOld && !isNaN(admissionDate.getTime());

  checks.push({
    id: 'admission_recency',
    label: 'Recent emergency admission verification',
    passed: admissionValid,
    reason: isFuture
      ? 'Admission date cannot be in the future.'
      : isTooOld
      ? `Admission occurred ${diffDays} days ago (exceeds ${config.MAX_ADMISSION_AGE_DAYS} day emergency threshold).`
      : `Admission date verified within active care window (${diffDays} day(s) ago).`,
  });

  // Check 5: Total > 0, <= MAX_GOAL_KOBO, and equals sum of line items
  const sumLineItems = record.lineItems.reduce((acc, item) => acc + item.amountKobo, 0);
  const totalMatches =
    record.totalKobo > 0 &&
    record.totalKobo <= config.MAX_GOAL_KOBO &&
    record.totalKobo === sumLineItems;

  checks.push({
    id: 'itemised_billing_integrity',
    label: 'Itemised clinical estimate integrity',
    passed: totalMatches,
    reason:
      record.totalKobo <= 0
        ? 'Total estimated amount must be greater than zero.'
        : record.totalKobo > config.MAX_GOAL_KOBO
        ? `Amount exceeds maximum emergency limit of ₦${(config.MAX_GOAL_KOBO / 100).toLocaleString()}.`
        : record.totalKobo !== sumLineItems
        ? `Sum of line items (₦${(sumLineItems / 100).toLocaleString()}) does not equal total (₦${(record.totalKobo / 100).toLocaleString()}).`
        : 'Itemised line items exactly match verified hospital estimate.',
  });

  // Check 6: No other live or funded campaign exists for the same patient + hospital
  const duplicate = existingActiveCampaigns.some(
    (c) =>
      c.hospitalOrgId === caseDoc.hospitalOrgId &&
      calculateTokenSimilarity(c.patientName, record.patientName) >= 0.85
  );

  checks.push({
    id: 'duplicate_campaign_guard',
    label: 'Duplicate active campaign audit',
    passed: !duplicate,
    reason: duplicate
      ? 'An active fundraising campaign already exists for this patient at this facility.'
      : 'No duplicate campaigns recorded for this patient.',
  });

  // Check 7: Payout account name resembles organization name
  const accountSim = calculateTokenSimilarity(
    record.payoutAccount.accountName,
    hospitalOrg.name
  );
  const accountMatches = accountSim >= config.ACCOUNT_NAME_THRESHOLD;

  checks.push({
    id: 'payout_entity_verification',
    label: 'Hospital direct disbursement account verification',
    passed: accountMatches,
    reason: accountMatches
      ? `Bank account entity matches hospital profile (${Math.round(accountSim * 100)}% match).`
      : `Payout account "${record.payoutAccount.accountName}" does not clearly match hospital name "${hospitalOrg.name}".`,
  });

  // Check 8: Patient public-page consent is recorded
  const consentGiven = Boolean(caseDoc.consent?.public);
  checks.push({
    id: 'patient_public_consent',
    label: 'Patient or caregiver public fundraising consent',
    passed: consentGiven,
    reason: consentGiven
      ? 'Patient consent recorded for public medical assistance case.'
      : 'Patient has not provided public assistance consent.',
  });

  // Decision determination
  const hardFailures = checks.filter((c) => c.isHardFailure && !c.passed);
  if (hardFailures.length > 0) {
    return {
      decision: 'rejected',
      checks,
      evaluatedAt: new Date().toISOString(),
    };
  }

  const allPassed = checks.every((c) => c.passed);
  if (allPassed) {
    return {
      decision: 'live',
      checks,
      evaluatedAt: new Date().toISOString(),
    };
  }

  return {
    decision: 'needs_review',
    checks,
    evaluatedAt: new Date().toISOString(),
  };
}
