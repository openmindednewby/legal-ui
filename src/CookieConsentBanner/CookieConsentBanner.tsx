/**
 * GDPR Cookie Consent Banner.
 *
 * Appears at the bottom of the screen on first visit. Allows the user to accept all,
 * reject all, or customise analytics/marketing cookies. Consent is persisted in
 * localStorage (via useCookieConsent) so the banner only shows once.
 */
import React, { useState, useCallback } from 'react';

import { StyleSheet, View, Text, Switch, Platform, TouchableOpacity } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ConsentButton, PRIVACY_LINK_HIT_STYLE } from '../ConsentButton/ConsentButton';
import { PrivacyPolicyModal } from '../PrivacyPolicyModal/PrivacyPolicyModal';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { LEGAL_TEST_IDS } from '../constants';

const BANNER_PADDING = 16;
const BANNER_MAX_WIDTH = 640;
const BORDER_RADIUS = 12;
const SECTION_GAP = 12;
const TOGGLE_MARGIN_TOP = 8;
const SHADOW_OFFSET_Y = -2;
const SHADOW_RADIUS = 8;
const SHADOW_OPACITY = 0.15;
const OVERLAY_ELEVATION = 20;
const BORDER_WIDTH = 1;
const MESSAGE_FONT_SIZE = 14;
const MESSAGE_LINE_HEIGHT = 20;
const SMALL_FONT_SIZE = 12;
const TOGGLE_DESC_MARGIN_TOP = 2;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: BANNER_PADDING,
    elevation: OVERLAY_ELEVATION,
    zIndex: OVERLAY_ELEVATION,
  },
  banner: {
    width: '100%',
    maxWidth: BANNER_MAX_WIDTH,
    borderRadius: BORDER_RADIUS,
    padding: BANNER_PADDING,
    borderWidth: BORDER_WIDTH,
    ...Platform.select({
      web: {
        boxShadow: `0px ${SHADOW_OFFSET_Y}px ${SHADOW_RADIUS}px rgba(0,0,0,${SHADOW_OPACITY})`,
      },
      default: {
        shadowOffset: { width: 0, height: SHADOW_OFFSET_Y },
        shadowRadius: SHADOW_RADIUS,
        shadowOpacity: SHADOW_OPACITY,
      },
    }),
  },
  message: { fontSize: MESSAGE_FONT_SIZE, lineHeight: MESSAGE_LINE_HEIGHT, marginBottom: SECTION_GAP },
  buttonRow: { flexDirection: 'row', gap: SECTION_GAP, flexWrap: 'wrap' },
  customiseSection: { marginTop: SECTION_GAP },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: TOGGLE_MARGIN_TOP,
  },
  toggleLabel: { fontSize: MESSAGE_FONT_SIZE, fontWeight: '600' },
  toggleDescription: { fontSize: SMALL_FONT_SIZE, marginTop: TOGGLE_DESC_MARGIN_TOP },
  privacyLink: { fontSize: SMALL_FONT_SIZE, textDecorationLine: 'underline' },
});

export const CookieConsentBanner = (): React.ReactElement | null => {
  const { theme, t } = useUi();
  const { showBanner, acceptAll, rejectAll, savePreferences } = useCookieConsent();

  const [showCustomise, setShowCustomise] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleCustomise = useCallback(() => {
    setShowCustomise((prev) => !prev);
  }, []);

  const handleSavePreferences = useCallback(() => {
    savePreferences(analytics, marketing);
  }, [analytics, marketing, savePreferences]);

  const handlePrivacyLink = useCallback(() => setShowPrivacy(true), []);
  const handleClosePrivacy = useCallback(() => setShowPrivacy(false), []);

  if (!showBanner) return null;

  const colors = theme.colors;
  const primary = theme.palette.primary['500'];

  return (
    <View style={styles.overlay} testID={LEGAL_TEST_IDS.cookieBanner}>
      <View style={[styles.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.message, { color: colors.text }]}>{t('cookieConsent.message')}</Text>

        <View style={styles.buttonRow}>
          <ConsentButton
            primary
            a11yHint={t('cookieConsent.acceptAllHint')}
            label={t('cookieConsent.acceptAll')}
            primaryColor={primary}
            testID={LEGAL_TEST_IDS.cookieAcceptAll}
            textColor={colors.surface}
            onPress={acceptAll}
          />
          <ConsentButton
            a11yHint={t('cookieConsent.rejectAllHint')}
            borderColor={colors.border}
            label={t('cookieConsent.rejectAll')}
            testID={LEGAL_TEST_IDS.cookieRejectAll}
            textColor={colors.text}
            onPress={rejectAll}
          />
          <ConsentButton
            a11yHint={t('cookieConsent.customizeHint')}
            borderColor={colors.border}
            label={t('cookieConsent.customize')}
            testID={LEGAL_TEST_IDS.cookieCustomize}
            textColor={colors.text}
            onPress={handleCustomise}
          />
        </View>

        {showCustomise ? (
          <View style={styles.customiseSection}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>{t('cookieConsent.necessaryLabel')}</Text>
                <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                  {t('cookieConsent.necessaryDescription')}
                </Text>
              </View>
              <Switch
                disabled
                value
                accessibilityHint={t('cookieConsent.essentialToggleHint')}
                accessibilityLabel={t('cookieConsent.necessaryLabel')}
                testID={LEGAL_TEST_IDS.cookieEssentialToggle}
                trackColor={{ true: primary, false: colors.border }}
              />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>{t('cookieConsent.analyticsLabel')}</Text>
                <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                  {t('cookieConsent.analyticsDescription')}
                </Text>
              </View>
              <Switch
                accessibilityHint={t('cookieConsent.analyticsToggleHint')}
                accessibilityLabel={t('cookieConsent.analyticsLabel')}
                testID={LEGAL_TEST_IDS.cookieAnalyticsToggle}
                trackColor={{ true: primary, false: colors.border }}
                value={analytics}
                onValueChange={setAnalytics}
              />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>{t('cookieConsent.marketingLabel')}</Text>
                <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                  {t('cookieConsent.marketingDescription')}
                </Text>
              </View>
              <Switch
                accessibilityHint={t('cookieConsent.marketingToggleHint')}
                accessibilityLabel={t('cookieConsent.marketingLabel')}
                testID={LEGAL_TEST_IDS.cookieMarketingToggle}
                trackColor={{ true: primary, false: colors.border }}
                value={marketing}
                onValueChange={setMarketing}
              />
            </View>

            <ConsentButton
              primary
              a11yHint={t('cookieConsent.savePreferencesHint')}
              label={t('cookieConsent.savePreferences')}
              primaryColor={primary}
              testID={LEGAL_TEST_IDS.cookieSavePreferences}
              textColor={colors.surface}
              onPress={handleSavePreferences}
            />
          </View>
        ) : null}

        <TouchableOpacity
          accessibilityHint={t('cookieConsent.privacyLinkHint')}
          accessibilityLabel={t('cookieConsent.privacyPolicyLink')}
          accessibilityRole="link"
          style={PRIVACY_LINK_HIT_STYLE}
          testID={LEGAL_TEST_IDS.cookiePrivacyLink}
          onPress={handlePrivacyLink}
        >
          <Text style={[styles.privacyLink, { color: primary }]}>{t('cookieConsent.privacyPolicyLink')}</Text>
        </TouchableOpacity>
      </View>
      <PrivacyPolicyModal visible={showPrivacy} onClose={handleClosePrivacy} />
    </View>
  );
};

export default CookieConsentBanner;
