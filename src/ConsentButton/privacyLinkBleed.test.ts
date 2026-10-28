import { privacyLinkBleed } from './privacyLinkBleed';

describe('privacyLinkBleed', () => {
  it('with a 16px text line in a 44px hit box, returns the 14px of box below the text', () => {
    const lineHeight = 16;

    const bleed = privacyLinkBleed(lineHeight);

    expect(bleed).toBe(14);
  });

  it('with a text line taller than the hit box, returns 0', () => {
    const lineHeight = 48;

    const bleed = privacyLinkBleed(lineHeight);

    expect(bleed).toBe(0);
  });
});
