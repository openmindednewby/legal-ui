import { renderHook, act } from '@testing-library/react';

import { useConsentBannerInset } from './useConsentBannerInset';
import { setConsentBannerHeight } from '../consentBannerInset';

describe('useConsentBannerInset', () => {
  afterEach(() => {
    act(() => setConsentBannerHeight(0));
  });

  it('with no banner measured, returns 0', () => {
    const { result } = renderHook(() => useConsentBannerInset());

    expect(result.current).toBe(0);
  });

  it('with a measured banner height, returns that height rounded up', () => {
    const { result } = renderHook(() => useConsentBannerInset());

    act(() => setConsentBannerHeight(212.4));

    expect(result.current).toBe(213);
  });

  it('with the banner dismissed after being measured, returns 0', () => {
    const { result } = renderHook(() => useConsentBannerInset());
    act(() => setConsentBannerHeight(212));

    act(() => setConsentBannerHeight(0));

    expect(result.current).toBe(0);
  });

  it('with a negative or non-finite height, returns 0', () => {
    const { result } = renderHook(() => useConsentBannerInset());

    act(() => setConsentBannerHeight(Number.NaN));

    expect(result.current).toBe(0);
  });
});
