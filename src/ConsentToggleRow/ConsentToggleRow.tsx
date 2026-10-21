import React, { useCallback } from 'react';

import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { MIN_HIT_PX } from '../ConsentButton/ConsentButton';

const ROW_MARGIN_TOP = 8;
const TEXT_GAP = 12;
const LABEL_FONT_SIZE = 14;
const DESCRIPTION_FONT_SIZE = 12;
const DESCRIPTION_MARGIN_TOP = 2;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: MIN_HIT_PX,
    marginTop: ROW_MARGIN_TOP,
  },
  text: { flex: 1, marginRight: TEXT_GAP },
  label: { fontSize: LABEL_FONT_SIZE, fontWeight: '600' },
  description: { fontSize: DESCRIPTION_FONT_SIZE, marginTop: DESCRIPTION_MARGIN_TOP },
});

export const CONSENT_TOGGLE_ROW_STYLE = styles.row;

/** Flips the toggle unless the row is disabled or read-only. */
export const pressConsentToggle = (
  value: boolean,
  disabled: boolean,
  onValueChange?: (next: boolean) => void,
): void => {
  if (disabled || onValueChange === undefined) return;
  onValueChange(!value);
};

export interface ConsentToggleRowProps {
  label: string;
  description: string;
  a11yHint: string;
  testID: string;
  value: boolean;
  textColor: string;
  secondaryTextColor: string;
  trackOnColor: string;
  trackOffColor: string;
  disabled?: boolean;
  onValueChange?: (next: boolean) => void;
}

export const ConsentToggleRow = ({
  label,
  description,
  a11yHint,
  testID,
  value,
  textColor,
  secondaryTextColor,
  trackOnColor,
  trackOffColor,
  disabled = false,
  onValueChange,
}: ConsentToggleRowProps): React.ReactElement => {
  const handlePress = useCallback(
    () => pressConsentToggle(value, disabled, onValueChange),
    [value, disabled, onValueChange],
  );

  return (
    <TouchableOpacity
      accessibilityHint={a11yHint}
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      style={styles.row}
      testID={testID}
      onPress={handlePress}
    >
      <View style={styles.text}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        <Text style={[styles.description, { color: secondaryTextColor }]}>{description}</Text>
      </View>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
        <Switch
          disabled={disabled}
          testID={`${testID}-switch`}
          trackColor={{ true: trackOnColor, false: trackOffColor }}
          value={value}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ConsentToggleRow;
