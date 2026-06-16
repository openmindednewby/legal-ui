/**
 * Hook for reading and writing GDPR cookie consent from localStorage.
 *
 * Returns the current consent state plus helpers to accept all,
 * reject all, or save custom preferences.
 */
import { useState, useCallback, useEffect } from 'react';

import { COOKIE_CONSENT_STORAGE_KEY } from '../constants';
import { CONSENT_VERSION, type CookieConsent } from '../types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Runtime type guard for stored consent records. */
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

export interface UseCookieConsentReturn {
  /** Current consent record, or null if user has not yet responded. */
  consent: CookieConsent | null;
  /** Whether the banner should be shown (no consent recorded yet). */
  showBanner: boolean;
  /** Accept all cookie categories. */
  acceptAll: () => void;
  /** Reject all optional cookie categories. */
  rejectAll: () => void;
  /** Save custom category preferences. */
  savePreferences: (analytics: boolean, marketing: boolean) => void;
}

function readConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isCookieConsent(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}

function buildConsent(analytics: boolean, marketing: boolean): CookieConsent {
  return {
    necessary: true,
    analytics,
    marketing,
    consentedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

export function useCookieConsent(): UseCookieConsentReturn {
  const [consent, setConsent] = useState<CookieConsent | null>(() => readConsent());

  // Re-read on mount to handle SSR hydration mismatch
  useEffect(() => {
    setConsent(readConsent());
  }, []);

  const acceptAll = useCallback(() => {
    const record = buildConsent(true, true);
    writeConsent(record);
    setConsent(record);
  }, []);

  const rejectAll = useCallback(() => {
    const record = buildConsent(false, false);
    writeConsent(record);
    setConsent(record);
  }, []);

  const savePreferences = useCallback((analytics: boolean, marketing: boolean) => {
    const record = buildConsent(analytics, marketing);
    writeConsent(record);
    setConsent(record);
  }, []);

  const showBanner = consent === null;

  return { consent, showBanner, acceptAll, rejectAll, savePreferences };
}
