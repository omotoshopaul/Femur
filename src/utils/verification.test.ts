import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateVerificationFreshness,
  calculateFundingProgress,
  isValidHexColor,
  checkTraumaReadiness,
} from './verification.ts';

test('freshness evaluator returns confirmed for updates under 2 hours', () => {
  const now = '2026-10-16T12:00:00Z';
  const recent = '2026-10-16T11:30:00Z'; // 30 mins ago
  assert.equal(evaluateVerificationFreshness(recent, now), 'confirmed');
});

test('freshness evaluator returns stale for updates older than 2 hours', () => {
  const now = '2026-10-16T12:00:00Z';
  const old = '2026-10-16T09:00:00Z'; // 3 hours ago
  assert.equal(evaluateVerificationFreshness(old, now), 'stale');
});

test('freshness evaluator returns unconfirmed for empty or invalid timestamps', () => {
  assert.equal(evaluateVerificationFreshness(''), 'unconfirmed');
  assert.equal(evaluateVerificationFreshness('invalid-timestamp'), 'unconfirmed');
});

test('funding progress calculations are properly bounded and rounded', () => {
  assert.equal(calculateFundingProgress(500, 1000), 50);
  assert.equal(calculateFundingProgress(0, 1000), 0);
  assert.equal(calculateFundingProgress(1500, 1000), 100);
  assert.equal(calculateFundingProgress(250, 750), 33);
  assert.equal(calculateFundingProgress(100, 0), 0);
});

test('design system hex colors meet validation format', () => {
  const tokens = ['#0F3F24', '#0A2E19', '#4F6B58', '#FDFDFB', '#3B1239', '#CFDACF', '#B42318'];
  for (const token of tokens) {
    assert.equal(isValidHexColor(token), true, `Token ${token} should be valid hex`);
  }
  assert.equal(isValidHexColor('rgb(0,0,0)'), false);
  assert.equal(isValidHexColor('not-a-color'), false);
});

test('trauma readiness audit flags missing resources correctly', () => {
  const fullyEquipped = {
    oxygenAvailable: true,
    bloodBankAvailable: true,
    icuBedsAvailable: 3,
  };
  const result1 = checkTraumaReadiness(fullyEquipped);
  assert.equal(result1.isReady, true);
  assert.equal(result1.missing.length, 0);

  const missingBlood = {
    oxygenAvailable: true,
    bloodBankAvailable: false,
    icuBedsAvailable: 2,
  };
  const result2 = checkTraumaReadiness(missingBlood);
  assert.equal(result2.isReady, false);
  assert.deepEqual(result2.missing, ['Blood Transfusion Reserve']);
});
