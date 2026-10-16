/**
 * FEMUR Global Design System Types
 * Emergency-Care Coordination Platform for Nigeria
 */

export type VerificationState = 'confirmed' | 'unconfirmed' | 'stale';

export interface VerifiedCapability {
  id: string;
  name: string;
  available: boolean;
  notes?: string;
}

export interface FacilitySampleData {
  id: string;
  name: string;
  facilityType: 'Tertiary Referral' | 'General Hospital' | 'Specialist Emergency' | 'Comprehensive Health Centre';
  location: {
    area: string;
    city: string;
    state: string;
    distanceKm?: number;
  };
  verificationState: VerificationState;
  lastConfirmedTime: string;
  lastConfirmedIso: string;
  verifiedCapabilities: VerifiedCapability[];
  emergencyContact: string;
  traumaLevel: string;
  bloodBankAvailable: boolean;
  oxygenAvailable: boolean;
  icuBedsAvailable?: number;
  isSampleData: true;
}

export interface AmbulanceProviderSampleData {
  id: string;
  providerName: string;
  vehicleType: 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Patient Transport Unit';
  baseLocation: string;
  coverageAreas: string[];
  operationalStatus: 'Available on Call' | 'In Transit' | 'Shift Transition';
  verificationState: VerificationState;
  lastConfirmedTime: string;
  contactChannel: string;
  providerNotice: string;
  isSampleData: true;
}

export interface FundingAssistanceSampleData {
  id: string;
  caseRef: string;
  patientInitials: string;
  verifiedHospitalName: string;
  medicalProcedure: string;
  verifiedBillAmountNgn: number;
  fundsRaisedNgn: number;
  assistanceType: 'Hospital-Verified Direct Grant' | 'Emergency NGO Subsidy' | 'Community Micro-Fund';
  verificationState: VerificationState;
  lastAuditTime: string;
  statusText: string;
  isSampleData: true;
}

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type AlertSeverity = 'danger' | 'warning' | 'info' | 'success';

export interface StatItem {
  id: string;
  numeral: string;
  caption: string;
  detail?: string;
}

export interface NavItem {
  label: string;
  href: string;
  eyebrow?: string;
}
