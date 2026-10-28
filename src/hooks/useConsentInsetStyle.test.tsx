import { renderHook, act } from '@testing-library/react';

import { useConsentInsetStyle } from './useConsentInsetStyle';
import { setConsentBannerHeight } from '../consentBannerInset';

describe('useConsentInsetStyle', () => {
  afterEach(() => {
    act(() => setConsentBannerHeight(0));
  });

  it('with the banner measured, pads by its height on the given screen background', () => {
    const { result } = renderHook(() => useConsentInsetStyle('#ffffff'));

    act(() => setConsentBannerHeight(218));

    expect(result.current).toEqual({ paddingBottom: 218, backgroundColor: '#ffffff' });
  });
});
