/**
 * FEMUR — Assist (Verified Cases, Campaigns, Case Wallets) Types
 */

export type CaseStatus =
  | 'draft'
  | 'awaiting_hospital_record'
  | 'auto_checking'
  | 'live'
  | 'needs_review'
  | 'rejected'
  | 'funded'
  | 'treatment_complete'
  | 'closed'
  | 'cancelled';

export interface PatientCaseConsent {
  public: boolean;
  firstNameOnly: boolean;
  showPhoto: boolean;
}

export interface CostLineItem {
  id: string;
  description: string;
  amountKobo: number;
}

export interface HospitalPayoutAccount {
  bankName: string;
  accountName: string;
  accountLast4: string;
}

export interface HospitalAdmissionRecord {
  patientName: string;
  admissionDate: string; // YYYY-MM-DD
  ward: string;
  treatingClinician: string;
  clinicianRole: string;
  conditionSummary: string; // max 160 chars
  lineItems: CostLineItem[];
  totalKobo: number;
  payoutAccount: HospitalPayoutAccount;
  submittedByUid: string;
  submittedByName: string;
  confirmedAdmitted: boolean;
  submittedAt: any;
  finalBillKobo?: number;
  treatmentCompletedAt?: any;
}

export interface EvaluationCheck {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
  isHardFailure?: boolean;
}

export interface EvaluationResult {
  decision: 'live' | 'needs_review' | 'rejected';
  checks: EvaluationCheck[];
  evaluatedAt: string;
}

export interface CaseDoc {
  id: string;
  patientUid: string;
  personId: string;
  patientNameClaimed: string;
  ageRange: '<18' | '18-35' | '36-55' | '56+';
  relationship: string;
  hospitalOrgId: string;
  hospitalName: string;
  admissionDateClaimed: string;
  situationText: string;
  consent: PatientCaseConsent;
  photoUrl?: string | null;
  status: CaseStatus;
  record?: HospitalAdmissionRecord;
  goalKobo: number;
  lastDecisionAt?: any;
  rejectionReason?: string;
  adminReviewNote?: string;
  evaluationResult?: EvaluationResult;
  createdAt: any;
  updatedAt: any;
}

export interface PublicCampaignDoc {
  id: string;
  displayName: string;
  photoUrl?: string | null;
  conditionSummary: string;
  hospitalName: string;
  goalKobo: number;
  raisedKobo: number;
  donorCount: number;
  status: 'live' | 'funded' | 'closed';
  updatedAt: any;
  lastDonationsPreview: {
    displayName: string;
    amountKobo: number;
    createdAt: any;
  }[];
}

export interface CaseWalletDoc {
  caseId: string;
  balanceKobo: number;
  totalInKobo: number;
  totalPaidOutKobo: number;
  loanInKobo: number;
  hospitalOrgId: string;
  currency: 'NGN';
  updatedAt: any;
}

export type LedgerEntryType =
  | 'donation'
  | 'sponsor'
  | 'loan'
  | 'payout'
  | 'surplus_transfer'
  | 'loan_return';

export interface LedgerEntryDoc {
  id: string;
  caseId: string;
  type: LedgerEntryType;
  amountKobo: number;
  sourceName: string;
  invoiceRef?: string;
  note?: string;
  createdAt: any;
  createdByUid: string;
}

export interface DonationDoc {
  id: string;
  caseId: string;
  amountKobo: number;
  donorDisplayName: string;
  anonymous: boolean;
  source: 'public' | 'sponsor';
  receiptId: string;
  idempotencyKey: string;
  simulated: true;
  createdAt: any;
}

export interface CareFundDoc {
  balanceKobo: number;
  updatedAt: any;
  history?: {
    id: string;
    caseId: string;
    amountKobo: number;
    patientName: string;
    hospitalName: string;
    date: string;
  }[];
}

export interface PilotRequestDoc {
  id?: string;
  orgName: string;
  orgType: 'Hospital or clinic' | 'Ambulance provider' | 'NGO or sponsor' | 'Government agency' | 'Other';
  state: string;
  lga: string;
  contactPerson: string;
  email: string;
  phone?: string;
  usageDescription?: string;
  agreedToTerms: boolean;
  status: 'new' | 'reviewed';
  createdAt: any;
}
