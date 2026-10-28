// Cookie consent
export { CookieConsentBanner } from './CookieConsentBanner/CookieConsentBanner';
export { ConsentButton } from './ConsentButton/ConsentButton';
export type { ConsentButtonProps } from './ConsentButton/ConsentButton';
export { useCookieConsent } from './hooks/useCookieConsent';
export type { UseCookieConsentReturn } from './hooks/useCookieConsent';
export { useConsentBannerInset } from './hooks/useConsentBannerInset';

// Legal pages/modals
export { PrivacyPolicyModal } from './PrivacyPolicyModal/PrivacyPolicyModal';
export type { PrivacyPolicyModalProps } from './PrivacyPolicyModal/PrivacyPolicyModal';
export { TermsOfServiceModal } from './TermsOfServiceModal/TermsOfServiceModal';
export type { TermsOfServiceModalProps } from './TermsOfServiceModal/TermsOfServiceModal';
export { LegalSection } from './LegalSection/LegalSection';
export type { LegalSectionProps } from './LegalSection/LegalSection';

// Types + constants
export { CONSENT_VERSION } from './types';
export type { CookieConsent } from './types';
export { COOKIE_CONSENT_STORAGE_KEY, LEGAL_TEST_IDS } from './constants';
