export const CONSENT_INSET_VAR = '--dlz-consent-inset';
const BODY_PADDING = 'padding-bottom';
const SCROLL_PADDING = 'scroll-padding-bottom';

function paddingOf(body: HTMLElement): number {
  const padding = Number.parseFloat(getComputedStyle(body).paddingBottom);
  return Number.isNaN(padding) ? 0 : padding;
}

function restoreProperty(style: CSSStyleDeclaration, name: string, value: string): void {
  if (value === '') style.removeProperty(name);
  else style.setProperty(name, value);
}

/** Reserves the live height of `banner` below the page and publishes it as `--dlz-consent-inset`; returns the release. */
export function reserveBannerSpace(banner: HTMLElement): () => void {
  const { body, documentElement: html } = banner.ownerDocument;
  const bodyPadding = body.style.getPropertyValue(BODY_PADDING);
  const scrollPadding = html.style.getPropertyValue(SCROLL_PADDING);
  const basePadding = paddingOf(body);
  const apply = (): void => {
    const height = Math.ceil(banner.getBoundingClientRect().height);
    html.style.setProperty(CONSENT_INSET_VAR, `${height}px`);
    html.style.setProperty(SCROLL_PADDING, `${height}px`);
    body.style.setProperty(BODY_PADDING, `${basePadding + height}px`);
  };
  apply();
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(apply);
  observer?.observe(banner);
  return () => {
    observer?.disconnect();
    html.style.removeProperty(CONSENT_INSET_VAR);
    restoreProperty(html.style, SCROLL_PADDING, scrollPadding);
    restoreProperty(body.style, BODY_PADDING, bodyPadding);
  };
}
