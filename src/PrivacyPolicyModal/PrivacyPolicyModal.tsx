/**
 * Privacy Policy modal — full-screen scrollable legal text built from translated sections.
 * Content keys live in the consuming app's locale files (legal.privacyPolicy.*).
 */
import React from 'react';

import { Modal, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';
import { SvgIcon } from '@dloizides/ui-icons';

import { LegalSection } from '../LegalSection/LegalSection';
import { LEGAL_TEST_IDS } from '../constants';

const CONTENT_PADDING = 16;
const BOTTOM_PADDING = 48;
const TITLE_FONT_SIZE = 24;
const TITLE_MARGIN_BOTTOM = 4;
const UPDATED_FONT_SIZE = 12;
const UPDATED_MARGIN_BOTTOM = 16;
const CLOSE_BUTTON_PADDING = 6;
const CLOSE_BUTTON_BORDER_RADIUS = 6;
const CLOSE_ICON_SIZE = 18;

const DEFAULT_LAST_UPDATED = '2026-03-12';

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: CONTENT_PADDING, paddingBottom: BOTTOM_PADDING },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: TITLE_FONT_SIZE, fontWeight: '700', marginBottom: TITLE_MARGIN_BOTTOM },
  lastUpdated: { fontSize: UPDATED_FONT_SIZE, marginBottom: UPDATED_MARGIN_BOTTOM },
  closeButton: {
    padding: CLOSE_BUTTON_PADDING,
    borderRadius: CLOSE_BUTTON_BORDER_RADIUS,
  },
});

const SECTIONS = [
  'introduction',
  'dataWeCollect',
  'howWeUse',
  'legalBasis',
  'dataSharing',
  'internationalTransfers',
  'dataRetention',
  'yourRights',
  'cookies',
  'childrenPrivacy',
  'dataSecurity',
  'policyChanges',
  'contact',
] as const;

export interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
  /** ISO date shown in the "last updated" line. Defaults to the bundled placeholder. */
  lastUpdated?: string;
}

export const PrivacyPolicyModal = ({
  visible,
  onClose,
  lastUpdated = DEFAULT_LAST_UPDATED,
}: PrivacyPolicyModalProps): React.ReactElement => {
  const { theme, t } = useUi();
  const colors = theme.colors;

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]} testID={LEGAL_TEST_IDS.privacyPolicyScreen}>
        <ScrollView
          accessibilityViewIsModal
          aria-label={t('legal.privacyPolicy.title')}
          contentContainerStyle={styles.scrollContent}
          role="dialog"
        >
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('legal.privacyPolicy.title')}
            </Text>
            <TouchableOpacity
              accessibilityHint={t('common.closeDialogHint')}
              accessibilityLabel={t('common.close')}
              accessibilityRole="button"
              style={styles.closeButton}
              testID={LEGAL_TEST_IDS.privacyPolicyClose}
              onPress={onClose}
            >
              <SvgIcon color={colors.textSecondary} name="close" size={CLOSE_ICON_SIZE} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            {t('legal.privacyPolicy.lastUpdated', lastUpdated)}
          </Text>

          {SECTIONS.map((key) => (
            <LegalSection
              key={key}
              body={t(`legal.privacyPolicy.${key}.body`)}
              title={t(`legal.privacyPolicy.${key}.title`)}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PrivacyPolicyModal;
