# Changelog

## 1.2.0

LEGAL-DOM-1 "Consent banner for DOM/canvas games". New framework-free entry `@dloizides/legal-ui/dom`:
`mountConsentBanner(host, options)` (plain DOM, no React), sharing the React banner's storage key,
categories, record shape and `cookieConsent.*` copy keys (`CONSENT_COPY_KEYS`). Colours from a
`@dloizides/design-tokens` preset; 44px hit boxes; arrow-key roving focus. Consent storage moved to
`consentStore.ts` (`readCookieConsent`, `writeCookieConsent`, `buildCookieConsent`).

## 1.0.0

Initial release (Capability Wave C1, batch 4). Extracted the proven (erevna+katalogos identical) GDPR
legal UI: `CookieConsentBanner` + `useCookieConsent` + `ConsentButton`, `PrivacyPolicyModal`,
`TermsOfServiceModal`, `LegalSection`. Shares the `@dloizides/ui-feedback` context (`useUi`) and
`@dloizides/ui-icons`. `LegalPage` deferred (app-specific landing/SEO coupling).
