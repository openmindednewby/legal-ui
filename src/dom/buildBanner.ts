import { LEGAL_TEST_IDS } from '../constants';

import { BANNER_CLASS } from './bannerStyles';
import type { ConsentBannerCopy } from './types';

const PRIMARY_MOD = `${BANNER_CLASS}__btn--primary`;

let idSeq = 0;

function nextId(part: string): string {
  idSeq += 1;
  return `${BANNER_CLASS}-${part}-${idSeq}`;
}

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag);
  if (className !== '') node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function withHint(target: HTMLElement, hint: string): HTMLSpanElement {
  const span = el(target.ownerDocument, 'span', `${BANNER_CLASS}__sr`, hint);
  span.id = nextId('hint');
  target.setAttribute('aria-describedby', span.id);
  return span;
}

export function makeButton(doc: Document, label: string, hint: string, testId: string, primary: boolean): HTMLButtonElement {
  const button = el(doc, 'button', primary ? `${BANNER_CLASS}__btn ${PRIMARY_MOD}` : `${BANNER_CLASS}__btn`, label);
  button.type = 'button';
  button.setAttribute('data-testid', testId);
  button.append(withHint(button, hint));
  return button;
}

export interface ToggleSpec {
  label: string;
  description: string;
  hint: string;
  testId: string;
  checked: boolean;
  disabled: boolean;
}

export function makeToggle(doc: Document, spec: ToggleSpec): { row: HTMLLabelElement; input: HTMLInputElement } {
  const row = el(doc, 'label', `${BANNER_CLASS}__toggle`);
  const text = el(doc, 'span', '');
  text.append(el(doc, 'span', `${BANNER_CLASS}__label`, spec.label), el(doc, 'span', `${BANNER_CLASS}__desc`, spec.description));
  const input = el(doc, 'input', '');
  input.type = 'checkbox';
  input.setAttribute('role', 'switch');
  input.checked = spec.checked;
  input.disabled = spec.disabled;
  input.setAttribute('aria-label', spec.label);
  input.setAttribute('data-testid', spec.testId);
  row.append(text, input, withHint(input, spec.hint));
  return { row, input };
}

function linkElement(doc: Document, text: string, url: string | undefined): HTMLElement {
  if (url === undefined || url === '') {
    const button = el(doc, 'button', `${BANNER_CLASS}__link`, text);
    button.type = 'button';
    return button;
  }
  const anchor = el(doc, 'a', `${BANNER_CLASS}__link`, text);
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

export function makePrivacyLink(doc: Document, copy: ConsentBannerCopy, url?: string, onOpen?: () => void): HTMLElement | null {
  const hasUrl = url !== undefined && url !== '';
  if (!hasUrl && onOpen === undefined) return null;
  const link = linkElement(doc, copy.privacyPolicyLink, url);
  if (onOpen !== undefined) link.addEventListener('click', onOpen);
  link.setAttribute('data-testid', LEGAL_TEST_IDS.cookiePrivacyLink);
  link.append(withHint(link, copy.privacyLinkHint));
  return link;
}

export function makeShell(doc: Document): { root: HTMLDivElement; panel: HTMLDivElement; messageId: string } {
  const root = el(doc, 'div', BANNER_CLASS);
  root.setAttribute('data-testid', LEGAL_TEST_IDS.cookieBanner);
  const panel = el(doc, 'div', `${BANNER_CLASS}__panel`);
  const messageId = nextId('message');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', messageId);
  root.append(panel);
  return { root, panel, messageId };
}

export function makeElement<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, part: string, text?: string): HTMLElementTagNameMap[K] {
  return el(doc, tag, `${BANNER_CLASS}__${part}`, text);
}
