/**
 * Pure logic utility for FEMUR emergency verification and design tokens
 */

import type { VerificationState } from '../types/index.ts';

/**
 * Evaluates whether a timestamp is considered confirmed, stale, or unconfirmed.
 * Stale threshold: > 120 minutes (2 hours).
 */
export function evaluateVerificationFreshness(
  lastConfirmedIso: string,
  currentIso: string = new Date().toISOString()
): VerificationState {
  if (!lastConfirmedIso) return 'unconfirmed';

  const lastTime = new Date(lastConfirmedIso).getTime();
  const now = new Date(currentIso).getTime();

  if (isNaN(lastTime) || isNaN(now)) {
    return 'unconfirmed';
  }

  const diffMinutes = (now - lastTime) / (1000 * 60);

  if (diffMinutes < 0) {
    return 'confirmed';
  }
  if (diffMinutes <= 120) {
    return 'confirmed';
  }
  return 'stale';
}

/**
 * Computes funding percentage capped between 0 and 100
 */
export function calculateFundingProgress(raised: number, total: number): number {
  if (total <= 0) return 0;
  if (raised <= 0) return 0;
  const pct = Math.round((raised / total) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Validates hex color code format
 */
export function isValidHexColor(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

/**
 * Checks essential clinical criteria for trauma triage readiness
 */
export function checkTraumaReadiness(facility: {
  oxygenAvailable: boolean;
  bloodBankAvailable: boolean;
  icuBedsAvailable?: number;
}): { isReady: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!facility.oxygenAvailable) missing.push('Oxygen Supply');
  if (!facility.bloodBankAvailable) missing.push('Blood Transfusion Reserve');
  if (!facility.icuBedsAvailable || facility.icuBedsAvailable <= 0) {
    missing.push('ICU Bed Vacancy');
  }

  return {
    isReady: missing.length === 0,
    missing,
  };
}
