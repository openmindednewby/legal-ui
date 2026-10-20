import type { DesignTokens } from '@dloizides/design-tokens';

import type { CookieConsent } from '../types';

/** Copy keys the banner reads; the same `cookieConsent.*` keys the React banner translates. */
export const CONSENT_COPY_KEYS = [
  'message',
  'acceptAll',
  'acceptAllHint',
  'rejectAll',
  'rejectAllHint',
  'customize',
  'customizeHint',
  'necessaryLabel',
  'necessaryDescription',
  'essentialToggleHint',
  'analyticsLabel',
  'analyticsDescription',
  'analyticsToggleHint',
  'marketingLabel',
  'marketingDescription',
  'marketingToggleHint',
  'savePreferences',
  'savePreferencesHint',
  'privacyPolicyLink',
  'privacyLinkHint',
] as const;

export type ConsentCopyKey = (typeof CONSENT_COPY_KEYS)[number];

/** Translated banner copy, supplied by the caller. */
export type ConsentBannerCopy = Record<ConsentCopyKey, string>;

export interface MountConsentBannerOptions {
  copy: ConsentBannerCopy;
  tokens: DesignTokens;
  dark?: boolean;
  privacyPolicyUrl?: string;
  onPrivacyPolicy?: () => void;
  onConsent?: (consent: CookieConsent) => void;
  force?: boolean;
  autoFocus?: boolean;
  arrowKeys?: boolean;
}

export interface ConsentBannerHandle {
  root: HTMLElement;
  focusables: () => HTMLElement[];
  destroy: () => void;
}
