/**
 * localStorage key for the persisted consent record. Kept as the exact string the
 * apps already used so existing visitors' stored consent is preserved after migration.
 */
export const COOKIE_CONSENT_STORAGE_KEY = 'COOKIE_CONSENT';

/**
 * Default testID strings — match the values the consuming apps already used so existing
 * Playwright selectors keep working.
 */
export const LEGAL_TEST_IDS = {
  cookieBanner: 'cookie-consent-banner',
  cookieAcceptAll: 'cookie-consent-accept-all',
  cookieRejectAll: 'cookie-consent-reject-all',
  cookieCustomize: 'cookie-consent-customize',
  cookieSavePreferences: 'cookie-consent-save-preferences',
  cookieEssentialToggle: 'cookie-consent-essential-toggle',
  cookieAnalyticsToggle: 'cookie-consent-analytics-toggle',
  cookieMarketingToggle: 'cookie-consent-marketing-toggle',
  cookiePrivacyLink: 'cookie-consent-privacy-link',
  privacyPolicyScreen: 'privacy-policy-screen',
  privacyPolicyClose: 'privacy-policy-close',
  termsOfServiceScreen: 'terms-of-service-screen',
  termsOfServiceClose: 'terms-of-service-close',
} as const;
