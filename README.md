# @dloizides/legal-ui

GDPR **cookie-consent banner** + **privacy/terms modals** (RN-web) for the dloizides.com portfolio.
Reads theme + translations from the shared `@dloizides/ui-feedback` context (`useUi`) and icons from
`@dloizides/ui-icons`.

## Components

| Export | Purpose |
|--------|---------|
| `CookieConsentBanner` | Bottom-of-screen GDPR banner: accept all / reject all / customise; persists in localStorage. |
| `useCookieConsent` | Hook: `{ consent, showBanner, acceptAll, rejectAll, savePreferences }`. |
| `PrivacyPolicyModal` / `TermsOfServiceModal` | Full-screen legal modals built from translated sections. |
| `LegalSection` | Title + body block used inside the modals. |
| `ConsentButton` | The banner's button primitive. |
| `LEGAL_TEST_IDS`, `COOKIE_CONSENT_STORAGE_KEY`, `CONSENT_VERSION`, `CookieConsent` | constants/types. |

`LegalPage` (the full standalone legal screen) is intentionally NOT here — it couples to app-specific
landing layout + SEO; extract when shared.

## Install

```bash
npm install @dloizides/legal-ui @dloizides/ui-feedback @dloizides/ui-icons react-native-svg
```

## Usage

Mount a `FeedbackUiProvider` / `UiProvider` (from `@dloizides/ui-feedback`) at the app root, then render
the banner once:

```tsx
import { CookieConsentBanner } from '@dloizides/legal-ui';

<CookieConsentBanner />
```

The components call the injected `t(key)` with `cookieConsent.*`, `legal.privacyPolicy.*`,
`legal.termsOfService.*` and `common.close*` keys — provide them in your locale files.

## License

MIT
