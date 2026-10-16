import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateCase,
  calculateTokenSimilarity,
  ASSIST_CONFIG,
} from './assist-rules.ts';
import type { CaseDoc, HospitalAdmissionRecord } from '../types/assist.ts';

const mockCase: CaseDoc = {
  id: 'case-101',
  patientUid: 'user-patient-1',
  personId: 'dep-1',
  patientNameClaimed: 'Amina Bello',
  ageRange: '18-35',
  relationship: 'Self',
  hospitalOrgId: 'org-luth',
  hospitalName: 'Lagos University Teaching Hospital (LUTH)',
  admissionDateClaimed: new Date().toISOString().slice(0, 10),
  situationText: 'Emergency asthma exacerbation requiring intensive care and oxygen.',
  consent: {
    public: true,
    firstNameOnly: true,
    showPhoto: false,
  },
  status: 'awaiting_hospital_record',
  goalKobo: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRecord: HospitalAdmissionRecord = {
  patientName: 'Amina Bello',
  admissionDate: new Date().toISOString().slice(0, 10),
  ward: 'Emergency Trauma Ward 3',
  treatingClinician: 'Dr. Tunde Fashola',
  clinicianRole: 'Chief Resident Pulmonology',
  conditionSummary: 'Acute asthma requiring non-invasive ventilation and oxygen therapy.',
  lineItems: [
    { id: 'li-1', description: 'Oxygen pipeline access 48h', amountKobo: 15_000_000 },
    { id: 'li-2', description: 'Intensive monitoring & meds', amountKobo: 20_000_000 },
  ],
  totalKobo: 35_000_000, // 350,000 NGN
  payoutAccount: {
    bankName: 'First Bank of Nigeria',
    accountName: 'Lagos University Teaching Hospital Operations',
    accountLast4: '8821',
  },
  submittedByUid: 'staff-1',
  submittedByName: 'Dr. Tunde Fashola',
  confirmedAdmitted: true,
  submittedAt: new Date(),
};

test('calculateTokenSimilarity accurately scores matching and partial strings', () => {
  assert.equal(calculateTokenSimilarity('Amina Bello', 'Amina Bello'), 1.0);
  assert.ok(calculateTokenSimilarity('Amina Bello', 'Bello Amina') >= 0.99);
  assert.ok(calculateTokenSimilarity('Amina M. Bello', 'Amina Bello') >= 0.8);
  assert.ok(calculateTokenSimilarity('John Doe', 'Amina Bello') < 0.2);
});

test('evaluateCase approves and returns decision live when all 8 checks pass', () => {
  const result = evaluateCase(
    mockCase,
    mockRecord,
    { role: 'hospital', verificationStatus: 'approved', organizationId: 'org-luth' },
    { name: 'Lagos University Teaching Hospital (LUTH)', verificationStatus: 'approved' }
  );

  assert.equal(result.decision, 'live');
  assert.equal(result.checks.length, 8);
  assert.ok(result.checks.every((c) => c.passed));
});

test('evaluateCase rejects when submitting clinician does not belong to the hospital (hard fail)', () => {
  const result = evaluateCase(
    mockCase,
    mockRecord,
    { role: 'hospital', verificationStatus: 'approved', organizationId: 'different-hospital-id' },
    { name: 'Lagos University Teaching Hospital (LUTH)', verificationStatus: 'approved' }
  );

  assert.equal(result.decision, 'rejected');
  const check1 = result.checks.find((c) => c.id === 'user_auth_and_affiliation');
  assert.equal(check1?.passed, false);
});

test('evaluateCase routes to needs_review when patient name differs or line items mismatch', () => {
  const mismatchRecord: HospitalAdmissionRecord = {
    ...mockRecord,
    totalKobo: 50_000_000, // mismatch against sum of 35_000_000
  };

  const result = evaluateCase(
    mockCase,
    mismatchRecord,
    { role: 'hospital', verificationStatus: 'approved', organizationId: 'org-luth' },
    { name: 'Lagos University Teaching Hospital (LUTH)', verificationStatus: 'approved' }
  );

  assert.equal(result.decision, 'needs_review');
  const check5 = result.checks.find((c) => c.id === 'itemised_billing_integrity');
  assert.equal(check5?.passed, false);
});

test('evaluateCase detects duplicate active campaign', () => {
  const result = evaluateCase(
    mockCase,
    mockRecord,
    { role: 'hospital', verificationStatus: 'approved', organizationId: 'org-luth' },
    { name: 'Lagos University Teaching Hospital (LUTH)', verificationStatus: 'approved' },
    [{ patientName: 'Amina Bello', hospitalOrgId: 'org-luth' }]
  );

  assert.equal(result.decision, 'needs_review');
  const check6 = result.checks.find((c) => c.id === 'duplicate_campaign_guard');
  assert.equal(check6?.passed, false);
});
