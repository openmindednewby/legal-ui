type Listener = () => void;

let bannerInset = 0;
const listeners = new Set<Listener>();

/** Records the cookie banner's on-screen height; 0 when it is hidden. */
export function setConsentBannerHeight(height: number): void {
  const next = Number.isFinite(height) && height > 0 ? Math.ceil(height) : 0;
  if (next === bannerInset) return;
  bannerInset = next;
  listeners.forEach((listener) => listener());
}

/** Current bottom inset reserved by the cookie banner, in px. */
export function getConsentBannerInset(): number {
  return bannerInset;
}

/** Subscribes to inset changes; returns the unsubscribe function. */
export function subscribeConsentBannerInset(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
