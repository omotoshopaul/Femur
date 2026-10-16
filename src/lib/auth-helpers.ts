/**
 * FEMUR — Pure auth & role access helper functions
 */

import type { UserRole, VerificationStatus, SponsorCase } from '../types/auth.ts';

/**
 * Anyone can self-register as a patient and is approved instantly.
 * hospital, ambulance_provider, and sponsor require admin approval ('pending').
 * admin accounts are approved.
 */
export function determineInitialVerificationStatus(role: UserRole): VerificationStatus {
  if (role === 'patient') {
    return 'approved';
  }
  if (role === 'admin') {
    return 'approved';
  }
  return 'pending';
}

/**
 * Checks if a user has clearance to access their role dashboard.
 */
export function canAccessRoleDashboard(
  role: UserRole,
  status: VerificationStatus
): boolean {
  if (role === 'admin') return true;
  if (role === 'patient') {
    return status === 'approved' || status === 'not_required';
  }
  return status === 'approved';
}

/**
 * Formats a currency amount into Nigerian Naira representation
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Filter sponsor cases by status
 */
export function filterSponsorCases(
  cases: SponsorCase[],
  filter: 'all' | 'seeking_support' | 'funded'
): SponsorCase[] {
  if (filter === 'all') return cases;
  if (filter === 'seeking_support') {
    return cases.filter((c) => c.status === 'seeking_support');
  }
  if (filter === 'funded') {
    return cases.filter((c) => c.status === 'funded' || c.status === 'under_treatment');
  }
  return cases;
}
