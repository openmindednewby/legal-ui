import { COOKIE_CONSENT_STORAGE_KEY } from './constants';
import { CONSENT_VERSION, type CookieConsent } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCookieConsent(value: unknown): value is CookieConsent {
  if (!isRecord(value)) return false;
  return (
    value['necessary'] === true &&
    typeof value['analytics'] === 'boolean' &&
    typeof value['marketing'] === 'boolean' &&
    typeof value['consentedAt'] === 'string' &&
    typeof value['version'] === 'string'
  );
}

/** Reads the stored consent record, or null when none is stored or it is malformed. */
export function readCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCookieConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Persists a consent record; a storage failure (private mode, quota) is swallowed. */
export function writeCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    return;
  }
}

/** Builds a consent record for the chosen optional categories, stamped now. */
export function buildCookieConsent(analytics: boolean, marketing: boolean): CookieConsent {
  return {
    necessary: true,
    analytics,
    marketing,
    consentedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}
