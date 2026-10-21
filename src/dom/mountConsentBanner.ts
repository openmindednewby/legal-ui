import { LEGAL_TEST_IDS } from '../constants';
import { buildCookieConsent, readCookieConsent, writeCookieConsent } from '../consentStore';

import { BANNER_CSS, bannerVars } from './bannerStyles';
import { makeButton, makeElement, makePrivacyLink, makeShell, makeToggle } from './buildBanner';
import type { ConsentBannerHandle, MountConsentBannerOptions } from './types';

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), a[href]';
const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown']);
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowUp']);

interface CustomiseParts {
  section: HTMLDivElement;
  analytics: HTMLInputElement;
  marketing: HTMLInputElement;
  save: HTMLButtonElement;
}

function visibleFocusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((node) => node.closest('[hidden]') === null);
}

function keyStep(key: string): number {
  if (NEXT_KEYS.has(key)) return 1;
  return PREV_KEYS.has(key) ? -1 : 0;
}

function moveFocus(root: HTMLElement, event: KeyboardEvent): void {
  const step = keyStep(event.key);
  const items = visibleFocusables(root);
  if (step === 0 || items.length === 0) return;
  event.preventDefault();
  const active = root.ownerDocument.activeElement;
  const current = items.findIndex((item) => item === active);
  const next = (current + step + items.length) % items.length;
  items[next]?.focus();
}

function buildCustomise(doc: Document, options: MountConsentBannerOptions): CustomiseParts {
  const { copy } = options;
  const section = makeElement(doc, 'div', 'custom');
  section.hidden = true;
  const essential = makeToggle(doc, { label: copy.necessaryLabel, description: copy.necessaryDescription, hint: copy.essentialToggleHint, testId: LEGAL_TEST_IDS.cookieEssentialToggle, checked: true, disabled: true });
  const analytics = makeToggle(doc, { label: copy.analyticsLabel, description: copy.analyticsDescription, hint: copy.analyticsToggleHint, testId: LEGAL_TEST_IDS.cookieAnalyticsToggle, checked: false, disabled: false });
  const marketing = makeToggle(doc, { label: copy.marketingLabel, description: copy.marketingDescription, hint: copy.marketingToggleHint, testId: LEGAL_TEST_IDS.cookieMarketingToggle, checked: false, disabled: false });
  const save = makeButton(doc, copy.savePreferences, copy.savePreferencesHint, LEGAL_TEST_IDS.cookieSavePreferences, true);
  section.append(essential.row, analytics.row, marketing.row, save);
  return { section, analytics: analytics.input, marketing: marketing.input, save };
}

function buildRoot(doc: Document, options: MountConsentBannerOptions): { root: HTMLDivElement; buttons: HTMLButtonElement[]; custom: CustomiseParts } {
  const { copy } = options;
  const { root, panel, messageId } = makeShell(doc, options.placement ?? 'fixed');
  Object.entries(bannerVars(options.tokens, options.dark === true)).forEach(([name, value]) => root.style.setProperty(name, value));
  const style = doc.createElement('style');
  style.textContent = BANNER_CSS;
  const message = makeElement(doc, 'p', 'message', copy.message);
  message.id = messageId;
  const accept = makeButton(doc, copy.acceptAll, copy.acceptAllHint, LEGAL_TEST_IDS.cookieAcceptAll, true);
  const reject = makeButton(doc, copy.rejectAll, copy.rejectAllHint, LEGAL_TEST_IDS.cookieRejectAll, false);
  const customise = makeButton(doc, copy.customize, copy.customizeHint, LEGAL_TEST_IDS.cookieCustomize, false);
  customise.setAttribute('aria-expanded', 'false');
  const row = makeElement(doc, 'div', 'row');
  row.append(accept, reject, customise);
  const custom = buildCustomise(doc, options);
  panel.append(message, row, custom.section);
  const link = makePrivacyLink(doc, copy, options.privacyPolicyUrl, options.onPrivacyPolicy);
  if (link !== null) panel.append(link);
  root.prepend(style);
  return { root, buttons: [accept, reject, customise], custom };
}

/** Mounts the cookie-consent banner into `host` with plain DOM; returns null when consent is already stored. */
export function mountConsentBanner(host: HTMLElement, options: MountConsentBannerOptions): ConsentBannerHandle | null {
  if (options.force !== true && readCookieConsent() !== null) return null;
  const { root, buttons, custom } = buildRoot(host.ownerDocument, options);
  const [accept, reject, customise] = buttons as [HTMLButtonElement, HTMLButtonElement, HTMLButtonElement];
  const onKey = (event: KeyboardEvent): void => moveFocus(root, event);
  const destroy = (): void => {
    root.removeEventListener('keydown', onKey);
    root.remove();
  };
  const decide = (analytics: boolean, marketing: boolean): void => {
    const record = buildCookieConsent(analytics, marketing);
    writeCookieConsent(record);
    destroy();
    options.onConsent?.(record);
  };
  accept.addEventListener('click', () => decide(true, true));
  reject.addEventListener('click', () => decide(false, false));
  custom.save.addEventListener('click', () => decide(custom.analytics.checked, custom.marketing.checked));
  customise.addEventListener('click', () => {
    custom.section.hidden = !custom.section.hidden;
    customise.setAttribute('aria-expanded', String(!custom.section.hidden));
  });
  if (options.arrowKeys !== false) root.addEventListener('keydown', onKey);
  host.append(root);
  if (options.autoFocus !== false) accept.focus();
  return { root, focusables: () => visibleFocusables(root), destroy };
}
