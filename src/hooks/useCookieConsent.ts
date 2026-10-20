/**
 * Hook for reading and writing GDPR cookie consent from localStorage.
 *
 * Returns the current consent state plus helpers to accept all,
 * reject all, or save custom preferences.
 */
import { useState, useCallback, useEffect } from 'react';

import { buildCookieConsent as buildConsent, readCookieConsent as readConsent, writeCookieConsent as writeConsent } from '../consentStore';
import type { CookieConsent } from '../types';

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
