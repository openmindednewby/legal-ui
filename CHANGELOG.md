# Changelog

## 1.4.0

OBS-1 "Every app ships metrics, production-grade logs and alerts" follow-up. `CookieConsentBanner` reports its
measured overlay height; new export `useConsentBannerInset()` returns it (0 when dismissed or unmounted) so a
host pads its screen content and the banner never covers a control.

## 1.3.2

LEGAL-DOM-1 "Consent banner for DOM/canvas games" follow-up. `ConsentToggleRow`: the display-only `Switch`
is now `inert` on web and hidden from assistive tech, so each optional row is a single Tab stop. The row
now also emits `aria-checked` on web.

## 1.3.1

LEGAL-DOM-1 "Consent banner for DOM/canvas games" follow-up. React `CookieConsentBanner` Customize panel:
each preference is now a full-width pressable row (`ConsentToggleRow`, min height 44, `accessibilityRole="switch"`)
that toggles on a row press; the 40x20 `Switch` is display-only inside it. Toggle testIDs move to the row.

## 1.3.0

LEGAL-DOM-1 "Consent banner for DOM/canvas games" follow-up. React `CookieConsentBanner`: Accept all /
Reject all / Customize / Save preferences and the Privacy policy link now have a 44x44 minimum hit box
(were 41px and 16px tall). `mountConsentBanner` gains `placement: 'fixed' | 'inline'` (default `fixed`);
`inline` lays the banner out in the host's flow so a host box contains it. The fixed panel caps to the
viewport (`100vh`/`100dvh` minus padding and safe area) and scrolls inside.

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
