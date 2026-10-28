/**
 * GDPR Cookie Consent Banner.
 *
 * Appears at the bottom of the screen on first visit. Allows the user to accept all,
 * reject all, or customise analytics/marketing cookies. Consent is persisted in
 * localStorage (via useCookieConsent) so the banner only shows once.
 */
import React, { useState, useCallback, useEffect } from 'react';

import { StyleSheet, View, Text, Platform, TouchableOpacity, type LayoutChangeEvent } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ConsentButton, PRIVACY_LINK_HIT_STYLE } from '../ConsentButton/ConsentButton';
import { ConsentToggleRow } from '../ConsentToggleRow/ConsentToggleRow';
import { PrivacyPolicyModal } from '../PrivacyPolicyModal/PrivacyPolicyModal';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { setConsentBannerHeight } from '../consentBannerInset';
import { LEGAL_TEST_IDS } from '../constants';

const BANNER_PADDING = 16;
const BANNER_MAX_WIDTH = 640;
const BORDER_RADIUS = 12;
const SECTION_GAP = 12;
const SHADOW_OFFSET_Y = -2;
const SHADOW_RADIUS = 8;
const SHADOW_OPACITY = 0.15;
const OVERLAY_ELEVATION = 20;
const BORDER_WIDTH = 1;
const MESSAGE_FONT_SIZE = 14;
const MESSAGE_LINE_HEIGHT = 20;
const SMALL_FONT_SIZE = 12;

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
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setConsentBannerHeight(event.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    if (!showBanner) setConsentBannerHeight(0);
    return () => setConsentBannerHeight(0);
  }, [showBanner]);

  if (!showBanner) return null;

  const colors = theme.colors;
  const primary = theme.palette.primary['500'];

  return (
    <View style={styles.overlay} testID={LEGAL_TEST_IDS.cookieBanner} onLayout={handleLayout}>
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
            <ConsentToggleRow
              disabled
              value
              a11yHint={t('cookieConsent.essentialToggleHint')}
              description={t('cookieConsent.necessaryDescription')}
              label={t('cookieConsent.necessaryLabel')}
              secondaryTextColor={colors.textSecondary}
              testID={LEGAL_TEST_IDS.cookieEssentialToggle}
              textColor={colors.text}
              trackOffColor={colors.border}
              trackOnColor={primary}
            />
            <ConsentToggleRow
              a11yHint={t('cookieConsent.analyticsToggleHint')}
              description={t('cookieConsent.analyticsDescription')}
              label={t('cookieConsent.analyticsLabel')}
              secondaryTextColor={colors.textSecondary}
              testID={LEGAL_TEST_IDS.cookieAnalyticsToggle}
              textColor={colors.text}
              trackOffColor={colors.border}
              trackOnColor={primary}
              value={analytics}
              onValueChange={setAnalytics}
            />
            <ConsentToggleRow
              a11yHint={t('cookieConsent.marketingToggleHint')}
              description={t('cookieConsent.marketingDescription')}
              label={t('cookieConsent.marketingLabel')}
              secondaryTextColor={colors.textSecondary}
              testID={LEGAL_TEST_IDS.cookieMarketingToggle}
              textColor={colors.text}
              trackOffColor={colors.border}
              trackOnColor={primary}
              value={marketing}
              onValueChange={setMarketing}
            />

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
