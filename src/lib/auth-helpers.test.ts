import test from 'node:test';
import assert from 'node:assert/strict';
import {
  determineInitialVerificationStatus,
  canAccessRoleDashboard,
  formatNaira,
  filterSponsorCases,
} from './auth-helpers.ts';
import type { SponsorCase } from '../types/auth.ts';

test('determineInitialVerificationStatus grants instant approval to patient', () => {
  assert.equal(determineInitialVerificationStatus('patient'), 'approved');
});

test('determineInitialVerificationStatus sets pending for hospital, ambulance, sponsor', () => {
  assert.equal(determineInitialVerificationStatus('hospital'), 'pending');
  assert.equal(determineInitialVerificationStatus('ambulance_provider'), 'pending');
  assert.equal(determineInitialVerificationStatus('sponsor'), 'pending');
});

test('canAccessRoleDashboard correctly permits approved users and restricts pending orgs', () => {
  assert.equal(canAccessRoleDashboard('patient', 'approved'), true);
  assert.equal(canAccessRoleDashboard('patient', 'not_required'), true);
  assert.equal(canAccessRoleDashboard('admin', 'pending'), true);
  assert.equal(canAccessRoleDashboard('hospital', 'pending'), false);
  assert.equal(canAccessRoleDashboard('hospital', 'approved'), true);
  assert.equal(canAccessRoleDashboard('ambulance_provider', 'pending'), false);
  assert.equal(canAccessRoleDashboard('sponsor', 'rejected'), false);
});

test('formatNaira produces correct currency representation', () => {
  const formatted = formatNaira(1500000);
  assert.ok(formatted.includes('1,500,000') || formatted.includes('1500000'));
});

test('filterSponsorCases filters by seeking_support and funded statuses', () => {
  const sampleCases: SponsorCase[] = [
    {
      id: 'c1',
      patientInitials: 'O.A.',
      procedure: 'Pediatric surgery',
      verifiedHospitalName: 'LUTH',
      requiredAmountNgn: 450000,
      fundedAmountNgn: 150000,
      status: 'seeking_support',
      verifiedTime: '2 hrs ago',
    },
    {
      id: 'c2',
      patientInitials: 'B.E.',
      procedure: 'Dialysis',
      verifiedHospitalName: 'Garki Hospital',
      requiredAmountNgn: 300000,
      fundedAmountNgn: 300000,
      status: 'funded',
      verifiedTime: '1 day ago',
    },
  ];

  const seeking = filterSponsorCases(sampleCases, 'seeking_support');
  assert.equal(seeking.length, 1);
  assert.equal(seeking[0].id, 'c1');

  const funded = filterSponsorCases(sampleCases, 'funded');
  assert.equal(funded.length, 1);
  assert.equal(funded[0].id, 'c2');

  const all = filterSponsorCases(sampleCases, 'all');
  assert.equal(all.length, 2);
});
