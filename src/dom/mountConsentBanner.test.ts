import { EREVNA_TOKENS } from '@dloizides/design-tokens';

import { COOKIE_CONSENT_STORAGE_KEY, LEGAL_TEST_IDS } from '../constants';
import { buildCookieConsent, writeCookieConsent } from '../consentStore';

import { BANNER_CSS, INLINE_CLASS } from './bannerStyles';
import { mountConsentBanner } from './mountConsentBanner';
import { CONSENT_COPY_KEYS, type ConsentBannerCopy, type MountConsentBannerOptions } from './types';

const COPY = Object.fromEntries(CONSENT_COPY_KEYS.map((key) => [key, `copy:${key}`])) as ConsentBannerCopy;

function options(extra: Partial<MountConsentBannerOptions> = {}): MountConsentBannerOptions {
  return { copy: COPY, tokens: EREVNA_TOKENS, ...extra };
}

function byTestId(id: string): HTMLElement {
  const node = document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
  if (node === null) throw new Error(`missing ${id}`);
  return node;
}

function cssRule(selector: string): string {
  const start = BANNER_CSS.indexOf(`${selector}{`);
  if (start === -1) throw new Error(`missing rule ${selector}`);
  return BANNER_CSS.slice(start, BANNER_CSS.indexOf('}', start));
}

function stored(): Record<string, unknown> | null {
  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return raw === null ? null : (JSON.parse(raw) as Record<string, unknown>);
}

describe('mountConsentBanner', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.innerHTML = '';
  });

  it('with consent already stored, returns null and mounts nothing', () => {
    writeCookieConsent(buildCookieConsent(false, false));

    const handle = mountConsentBanner(document.body, options());

    expect(handle).toBeNull();
    expect(document.querySelector(`[data-testid="${LEGAL_TEST_IDS.cookieBanner}"]`)).toBeNull();
  });

  it('with force and consent stored, mounts the banner', () => {
    writeCookieConsent(buildCookieConsent(false, false));

    const handle = mountConsentBanner(document.body, options({ force: true }));

    expect(handle?.root.isConnected).toBe(true);
  });

  it('on accept all, stores both categories, removes the banner and reports the record', () => {
    const onConsent = jest.fn();
    mountConsentBanner(document.body, options({ onConsent }));

    byTestId(LEGAL_TEST_IDS.cookieAcceptAll).click();

    expect(stored()).toMatchObject({ necessary: true, analytics: true, marketing: true, version: '1.0' });
    expect(onConsent).toHaveBeenCalledWith(expect.objectContaining({ analytics: true, marketing: true }));
    expect(document.querySelector(`[data-testid="${LEGAL_TEST_IDS.cookieBanner}"]`)).toBeNull();
  });

  it('on reject all, stores both optional categories off', () => {
    mountConsentBanner(document.body, options());

    byTestId(LEGAL_TEST_IDS.cookieRejectAll).click();

    expect(stored()).toMatchObject({ analytics: false, marketing: false });
  });

  it('on save preferences after ticking analytics, stores analytics only', () => {
    mountConsentBanner(document.body, options());
    byTestId(LEGAL_TEST_IDS.cookieCustomize).click();
    (byTestId(LEGAL_TEST_IDS.cookieAnalyticsToggle) as HTMLInputElement).click();

    byTestId(LEGAL_TEST_IDS.cookieSavePreferences).click();

    expect(stored()).toMatchObject({ analytics: true, marketing: false });
  });

  it('on customise, reveals the toggles and flips aria-expanded', () => {
    const handle = mountConsentBanner(document.body, options());

    byTestId(LEGAL_TEST_IDS.cookieCustomize).click();

    expect(byTestId(LEGAL_TEST_IDS.cookieCustomize).getAttribute('aria-expanded')).toBe('true');
    expect(handle?.focusables()).toContain(byTestId(LEGAL_TEST_IDS.cookieSavePreferences));
  });

  it('with the customise panel closed, exposes only the three choice buttons as focusable', () => {
    const handle = mountConsentBanner(document.body, options());

    const ids = handle?.focusables().map((node) => node.getAttribute('data-testid'));

    expect(ids).toEqual([LEGAL_TEST_IDS.cookieAcceptAll, LEGAL_TEST_IDS.cookieRejectAll, LEGAL_TEST_IDS.cookieCustomize]);
  });

  it('on ArrowRight from the last control, wraps focus to the first', () => {
    mountConsentBanner(document.body, options());
    byTestId(LEGAL_TEST_IDS.cookieCustomize).focus();

    byTestId(LEGAL_TEST_IDS.cookieCustomize).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(byTestId(LEGAL_TEST_IDS.cookieAcceptAll));
  });

  it('with arrowKeys off, leaves arrow keys to the host', () => {
    mountConsentBanner(document.body, options({ arrowKeys: false }));
    byTestId(LEGAL_TEST_IDS.cookieAcceptAll).focus();

    byTestId(LEGAL_TEST_IDS.cookieAcceptAll).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(byTestId(LEGAL_TEST_IDS.cookieAcceptAll));
  });

  it('on mount, focuses accept all by default', () => {
    mountConsentBanner(document.body, options());

    const active = document.activeElement;

    expect(active).toBe(byTestId(LEGAL_TEST_IDS.cookieAcceptAll));
  });

  it('with a privacy URL, renders an anchor to it opened in a new tab', () => {
    mountConsentBanner(document.body, options({ privacyPolicyUrl: 'https://example.test/privacy' }));

    const link = byTestId(LEGAL_TEST_IDS.cookiePrivacyLink) as HTMLAnchorElement;

    expect(link.href).toBe('https://example.test/privacy');
    expect(link.rel).toContain('noopener');
  });

  it('with neither a privacy URL nor a handler, renders no privacy link', () => {
    mountConsentBanner(document.body, options());

    const link = document.querySelector(`[data-testid="${LEGAL_TEST_IDS.cookiePrivacyLink}"]`);

    expect(link).toBeNull();
  });

  it('with a privacy handler, calls it on click', () => {
    const onPrivacyPolicy = jest.fn();
    mountConsentBanner(document.body, options({ onPrivacyPolicy }));

    byTestId(LEGAL_TEST_IDS.cookiePrivacyLink).click();

    expect(onPrivacyPolicy).toHaveBeenCalledTimes(1);
  });

  it('with dark mode, sets the surface variable from the dark token set', () => {
    const handle = mountConsentBanner(document.body, options({ dark: true }));

    const surface = handle?.root.style.getPropertyValue('--dlz-consent-surface');

    expect(surface).toBe(EREVNA_TOKENS.dark.surface);
  });

  it('on destroy, removes the banner without storing consent', () => {
    const handle = mountConsentBanner(document.body, options());

    handle?.destroy();

    expect(handle?.root.isConnected).toBe(false);
    expect(stored()).toBeNull();
  });
  it('without a placement, mounts fixed to the viewport', () => {
    const handle = mountConsentBanner(document.body, options());

    const placement = handle?.root.getAttribute('data-placement');

    expect(placement).toBe('fixed');
    expect(handle?.root.classList.contains(INLINE_CLASS)).toBe(false);
  });

  it('with inline placement, adds the inline modifier inside the host', () => {
    const host = document.createElement('div');
    document.body.append(host);

    const handle = mountConsentBanner(host, options({ placement: 'inline' }));

    expect(handle?.root.classList.contains(INLINE_CLASS)).toBe(true);
    expect(handle?.root.parentElement).toBe(host);
  });

  it('for the inline modifier, lays out in flow instead of fixed', () => {
    const rule = cssRule(`.${INLINE_CLASS}`);

    expect(rule).toContain('position:relative');
    expect(rule).toContain('max-height:100%');
  });

  it('for the fixed panel, caps to the viewport and scrolls inside', () => {
    const rule = cssRule('.dlz-consent__panel');

    expect(rule).toContain('max-height:calc(100dvh -');
    expect(rule).toContain('max-height:calc(100vh -');
    expect(rule).toContain('overflow-y:auto');
  });

  it('for every banner control, sets a 44px minimum hit box', () => {
    const rules = ['.dlz-consent__btn', '.dlz-consent__link', '.dlz-consent__toggle'].map(cssRule);

    rules.forEach((rule) => expect(rule).toContain('min-height:44px'));
  });
});
