import { Z_INDEX, resolveOnBrand, type DesignTokens } from '@dloizides/design-tokens';

export const BANNER_CLASS = 'dlz-consent';

const MIN_HIT_PX = 44;
const MAX_WIDTH_PX = 640;
const GAP_PX = 12;
const PAD_PX = 16;
const FOCUS_RING_PX = 3;
const FONT_PX = 14;
const SMALL_FONT_PX = 12;
const LINE_HEIGHT = 1.45;
const DEFAULT_RADIUS = '12px';
const DEFAULT_BUTTON_RADIUS = '8px';

export function bannerVars(tokens: DesignTokens, dark: boolean): Record<string, string> {
  const mode = dark ? tokens.dark : tokens.light;
  return {
    '--dlz-consent-surface': mode.surface,
    '--dlz-consent-text': mode.text,
    '--dlz-consent-text-secondary': mode.textSecondary,
    '--dlz-consent-border': mode.border,
    '--dlz-consent-primary': tokens.primary,
    '--dlz-consent-on-primary': resolveOnBrand(tokens.primary, tokens.onBrand),
    '--dlz-consent-focus': mode.focusRing ?? tokens.primary,
    '--dlz-consent-radius': tokens.radii?.lg ?? DEFAULT_RADIUS,
    '--dlz-consent-button-radius': tokens.radii?.sm ?? DEFAULT_BUTTON_RADIUS,
    '--dlz-consent-shadow': tokens.shadows?.pop ?? 'none',
    '--dlz-consent-font': tokens.typography?.fontFamily ?? 'inherit',
  };
}

const c = `.${BANNER_CLASS}`;

export const BANNER_CSS = [
  `${c}{position:fixed;left:0;right:0;bottom:0;z-index:${Z_INDEX.toast};display:flex;justify-content:center;padding:${PAD_PX}px;padding-bottom:max(${PAD_PX}px,env(safe-area-inset-bottom));box-sizing:border-box;pointer-events:none;font-family:var(--dlz-consent-font);font-size:${FONT_PX}px;line-height:${LINE_HEIGHT}}`,
  `${c} *{box-sizing:border-box}`,
  `${c}__panel{pointer-events:auto;width:100%;max-width:${MAX_WIDTH_PX}px;max-height:calc(100dvh - ${PAD_PX * 2}px);overflow-y:auto;padding:${PAD_PX}px;border:1px solid var(--dlz-consent-border);border-radius:var(--dlz-consent-radius);background:var(--dlz-consent-surface);color:var(--dlz-consent-text);box-shadow:var(--dlz-consent-shadow)}`,
  `${c}__message{margin:0 0 ${GAP_PX}px}`,
  `${c}__row{display:flex;flex-wrap:wrap;gap:${GAP_PX}px}`,
  `${c}__btn{flex:1 1 auto;min-height:${MIN_HIT_PX}px;min-width:${MIN_HIT_PX}px;padding:0 ${PAD_PX}px;border:1px solid var(--dlz-consent-border);border-radius:var(--dlz-consent-button-radius);background:transparent;color:var(--dlz-consent-text);font:inherit;font-weight:600;cursor:pointer;touch-action:manipulation}`,
  `${c}__btn--primary{background:var(--dlz-consent-primary);border-color:var(--dlz-consent-primary);color:var(--dlz-consent-on-primary)}`,
  `${c}__btn:focus-visible,${c}__link:focus-visible,${c}__toggle input:focus-visible{outline:${FOCUS_RING_PX}px solid var(--dlz-consent-focus);outline-offset:2px}`,
  `${c}__custom{margin-top:${GAP_PX}px;display:flex;flex-direction:column;gap:4px}`,
  `${c}__custom[hidden]{display:none}`,
  `${c}__toggle{display:flex;align-items:center;justify-content:space-between;gap:${GAP_PX}px;min-height:${MIN_HIT_PX}px;cursor:pointer}`,
  `${c}__toggle input{width:${MIN_HIT_PX / 2}px;height:${MIN_HIT_PX / 2}px;flex:none;margin:0;accent-color:var(--dlz-consent-primary)}`,
  `${c}__label{display:block;font-weight:600}`,
  `${c}__desc{display:block;font-size:${SMALL_FONT_PX}px;color:var(--dlz-consent-text-secondary)}`,
  `${c}__link{display:inline-flex;align-items:center;min-height:${MIN_HIT_PX}px;margin-top:4px;padding:0;border:0;background:none;color:var(--dlz-consent-primary);font:inherit;font-size:${SMALL_FONT_PX}px;text-decoration:underline;cursor:pointer}`,
  `${c}__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}`,
].join('');
