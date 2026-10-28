import { useMemo } from 'react';

import { useConsentBannerInset } from './useConsentBannerInset';
import { consentInsetStyle, type ConsentInsetStyle } from '../consentInsetStyle';

/** Navigator content style: pads by the cookie banner height on the given screen background. */
export function useConsentInsetStyle(backgroundColor: string): ConsentInsetStyle {
  const inset = useConsentBannerInset();
  return useMemo(() => consentInsetStyle(inset, backgroundColor), [inset, backgroundColor]);
}
