import { renderHook, act } from '@testing-library/react';

import { useCookieConsent } from './useCookieConsent';
import { COOKIE_CONSENT_STORAGE_KEY } from '../constants';

describe('useCookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the banner when no consent is stored', () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.showBanner).toBe(true);
    expect(result.current.consent).toBeNull();
  });

  it('acceptAll persists consent with both categories enabled and hides the banner', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.acceptAll());
    expect(result.current.showBanner).toBe(false);
    expect(result.current.consent?.analytics).toBe(true);
    expect(result.current.consent?.marketing).toBe(true);
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string).necessary).toBe(true);
  });

  it('rejectAll persists with optional categories disabled', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.rejectAll());
    expect(result.current.consent?.analytics).toBe(false);
    expect(result.current.consent?.marketing).toBe(false);
  });

  it('savePreferences persists the chosen categories', () => {
    const { result } = renderHook(() => useCookieConsent());
    act(() => result.current.savePreferences(true, false));
    expect(result.current.consent?.analytics).toBe(true);
    expect(result.current.consent?.marketing).toBe(false);
  });

  it('reads back a previously stored valid consent', () => {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify({ necessary: true, analytics: true, marketing: false, consentedAt: '2026-01-01T00:00:00.000Z', version: '1.0' }),
    );
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.showBanner).toBe(false);
    expect(result.current.consent?.analytics).toBe(true);
  });
});
