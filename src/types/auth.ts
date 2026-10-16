/**
 * FEMUR Authentication, Roles, and Dashboards Types
 */

export type UserRole = 'patient' | 'hospital' | 'ambulance_provider' | 'sponsor' | 'admin';

export type VerificationStatus = 'not_required' | 'pending' | 'approved' | 'rejected';

export interface UserDoc {
  displayName: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  organizationId?: string | null;
  rejectionReason?: string;
  createdAt: any;
}

export interface OrganizationDoc {
  id?: string;
  name: string;
  type: 'hospital' | 'ambulance_provider' | 'sponsor';
  state: string;
  lga: string;
  ownerUid: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: any;
}

export interface PatientProfileDoc {
  phone?: string;
  emergencyContact?: string;
  consentGivenAt: any;
}

export interface PersonDependent {
  id: string;
  name: string;
  relationship: string;
  bloodGroup?: string;
  allergies?: string;
  notes?: string;
}

export interface EmergencyRequestDoc {
  id: string;
  createdByUid: string;
  type: 'care' | 'transport' | 'assistance';
  status: 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  needSummary: string;
  locationText: string;
  sharedWith: string[];
  createdAt: any;
  updatedAt?: any;
  ambulanceProviderName?: string;
  hospitalName?: string;
  etaMinutes?: number;
}

/** Hospital specific types */
export interface IncomingPatient {
  id: string;
  patientInitials: string;
  acuity: 'immediate' | 'urgent' | 'stable';
  etaMinutes: number;
  triageSummary: string;
  transportUnit: string;
  status: 'en_route' | 'acknowledged' | 'arrived';
}

export interface HospitalResourceState {
  id: string;
  name: string;
  statusText: string;
  isAvailable: boolean;
  lastConfirmedTime: string;
  lastConfirmedDate: Date;
}

export interface AssistanceVerificationItem {
  id: string;
  patientInitials: string;
  diagnosis: string;
  estimatedCostNgn: number;
  submittedTime: string;
  verified: boolean;
  hospitalName: string;
}

/** Ambulance provider specific types */
export interface DispatchRequest {
  id: string;
  pickupLocation: string;
  destinationHospital: string;
  patientAcuity: 'Immediate (Red)' | 'Urgent (Yellow)' | 'Stable (Green)';
  distanceKm: number;
  timeReceived: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface AmbulanceVehicle {
  id: string;
  callSign: string;
  vehicleType: 'Basic Life Support (BLS)' | 'Advanced Life Support (ALS)';
  crewMembers: string;
  status: 'Available' | 'En route' | 'Maintenance';
}

/** Sponsor specific types */
export interface SponsorCase {
  id: string;
  patientInitials: string;
  procedure: string;
  verifiedHospitalName: string;
  requiredAmountNgn: number;
  fundedAmountNgn: number;
  status: 'seeking_support' | 'funded' | 'under_treatment' | 'discharged';
  verifiedTime: string;
}

/** Admin specific types */
export interface PlatformPulseStats {
  activeRequests: number;
  availableAmbulances: number;
  openHospitals: number;
  fundsDeployedNgn: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: 'info' | 'warning' | 'critical';
}
