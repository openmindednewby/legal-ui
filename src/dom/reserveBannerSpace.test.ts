import { CONSENT_INSET_VAR, reserveBannerSpace } from './reserveBannerSpace';

const BANNER_HEIGHT = 180;
const GROWN_HEIGHT = 420;

function bannerOfHeight(height: number): HTMLElement {
  const banner = document.createElement('div');
  banner.getBoundingClientRect = (): DOMRect => ({ height }) as DOMRect;
  document.body.append(banner);
  return banner;
}

describe('reserveBannerSpace', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.body.removeAttribute('style');
    document.documentElement.removeAttribute('style');
  });

  it('with a measured banner, publishes its height and reserves it below the page', () => {
    const banner = bannerOfHeight(BANNER_HEIGHT);

    reserveBannerSpace(banner);

    expect(document.documentElement.style.getPropertyValue(CONSENT_INSET_VAR)).toBe('180px');
    expect(document.body.style.paddingBottom).toBe('180px');
    expect(document.documentElement.style.scrollPaddingBottom).toBe('180px');
  });

  it('with page padding already set, adds the banner height on top of it', () => {
    document.body.style.paddingBottom = '20px';
    const banner = bannerOfHeight(BANNER_HEIGHT);

    reserveBannerSpace(banner);

    expect(document.body.style.paddingBottom).toBe('200px');
  });

  it('when released, restores the page exactly as it was', () => {
    document.body.style.paddingBottom = '20px';
    document.documentElement.style.scrollPaddingBottom = '8px';
    const release = reserveBannerSpace(bannerOfHeight(BANNER_HEIGHT));

    release();

    expect(document.documentElement.style.getPropertyValue(CONSENT_INSET_VAR)).toBe('');
    expect(document.body.style.paddingBottom).toBe('20px');
    expect(document.documentElement.style.scrollPaddingBottom).toBe('8px');
  });

  it('with no ResizeObserver in the environment, still reserves the first measure', () => {
    Reflect.deleteProperty(globalThis, 'ResizeObserver');

    reserveBannerSpace(bannerOfHeight(BANNER_HEIGHT));

    expect(document.body.style.paddingBottom).toBe('180px');
  });

  describe('with a ResizeObserver', () => {
    let notify: () => void = () => undefined;
    const disconnect = jest.fn();

    beforeEach(() => {
      disconnect.mockClear();
      globalThis.ResizeObserver = class {
        public observe = jest.fn();
        public unobserve = jest.fn();
        public disconnect = disconnect;

        public constructor(callback: () => void) {
          notify = callback;
        }
      } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
      Reflect.deleteProperty(globalThis, 'ResizeObserver');
    });

    it('when the banner grows, follows the new height', () => {
      const banner = bannerOfHeight(BANNER_HEIGHT);
      reserveBannerSpace(banner);
      banner.getBoundingClientRect = (): DOMRect => ({ height: GROWN_HEIGHT }) as DOMRect;

      notify();

      expect(document.documentElement.style.getPropertyValue(CONSENT_INSET_VAR)).toBe('420px');
      expect(document.body.style.paddingBottom).toBe('420px');
    });

    it('when released, stops observing', () => {
      const release = reserveBannerSpace(bannerOfHeight(BANNER_HEIGHT));

      release();

      expect(disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
