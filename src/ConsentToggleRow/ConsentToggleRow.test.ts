import { StyleSheet } from 'react-native';

import { MIN_HIT_PX } from '../ConsentButton/ConsentButton';

import { CONSENT_TOGGLE_ROW_STYLE, pressConsentToggle } from './ConsentToggleRow';

describe('CONSENT_TOGGLE_ROW_STYLE', () => {
  it('for a preference row, sets min height to the hit minimum and spans the full width', () => {
    const style = StyleSheet.flatten(CONSENT_TOGGLE_ROW_STYLE);

    expect(style).toMatchObject({ minHeight: MIN_HIT_PX, width: '100%' });
  });
});

describe('pressConsentToggle', () => {
  it('with an enabled row that is off, turns it on', () => {
    const onValueChange = jest.fn();

    pressConsentToggle(false, false, onValueChange);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('with an enabled row that is on, turns it off', () => {
    const onValueChange = jest.fn();

    pressConsentToggle(true, false, onValueChange);

    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('with a disabled row, does not change the value', () => {
    const onValueChange = jest.fn();

    pressConsentToggle(true, true, onValueChange);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('with no change handler, does nothing', () => {
    const act = (): void => pressConsentToggle(false, false);

    expect(act).not.toThrow();
  });
});
