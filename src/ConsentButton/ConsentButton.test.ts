import { StyleSheet } from 'react-native';

import { CONSENT_BUTTON_STYLE, MIN_HIT_PX, PRIVACY_LINK_HIT_STYLE } from './ConsentButton';

describe('consent hit boxes', () => {
  it('with the shared minimum, is at least 44px', () => {
    const minimum = MIN_HIT_PX;

    expect(minimum).toBeGreaterThanOrEqual(44);
  });

  it('for a consent button, sets min height and min width to the hit minimum', () => {
    const style = StyleSheet.flatten(CONSENT_BUTTON_STYLE);

    expect(style).toMatchObject({ minHeight: MIN_HIT_PX, minWidth: MIN_HIT_PX });
  });

  it('for the privacy policy link, sets min height and min width to the hit minimum', () => {
    const style = StyleSheet.flatten(PRIVACY_LINK_HIT_STYLE);

    expect(style).toMatchObject({ minHeight: MIN_HIT_PX, minWidth: MIN_HIT_PX });
  });
});
