import { useSyncExternalStore } from 'react';

import { getConsentBannerInset, subscribeConsentBannerInset } from '../consentBannerInset';

/** Bottom padding (px) a screen needs so the cookie banner never covers its content. */
export function useConsentBannerInset(): number {
  return useSyncExternalStore(subscribeConsentBannerInset, getConsentBannerInset, getConsentBannerInset);
}
