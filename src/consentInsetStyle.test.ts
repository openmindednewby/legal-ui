import { consentInsetStyle } from './consentInsetStyle';

describe('consentInsetStyle', () => {
  it('with a banner inset and a screen background, pads by the inset on that background', () => {
    const inset = 302;
    const screenBackground = '#ffffff';

    const style = consentInsetStyle(inset, screenBackground);

    expect(style).toEqual({ paddingBottom: 302, backgroundColor: '#ffffff' });
  });

  it('with no banner shown, keeps the screen background and pads by 0', () => {
    const screenBackground = '#0b1414';

    const style = consentInsetStyle(0, screenBackground);

    expect(style).toEqual({ paddingBottom: 0, backgroundColor: '#0b1414' });
  });
});
