import { MIN_HIT_PX } from './hitSize';

export const PRIVACY_LINK_LINE_HEIGHT = 16;

/** Invisible hit-box height below a text line centred in a MIN_HIT_PX box. */
export function privacyLinkBleed(lineHeight: number): number {
  return Math.max(0, (MIN_HIT_PX - lineHeight) / 2);
}
