import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Set EXPO_APPLE_TEAM_ID on your Mac (or put appleTeamId below) so
 * @bacons/apple-targets / Xcode signing can resolve your team.
 * Find it in Xcode → Settings → Accounts → Team ID (10 characters).
 */
const appleTeamId =
  process.env.EXPO_APPLE_TEAM_ID || process.env.APPLE_TEAM_ID || undefined;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Daily Vocab',
  slug: 'daily-vocab',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'dailyvocab',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.dailyvocab.app',
    ...(appleTeamId ? { appleTeamId } : {}),
    entitlements: {
      'com.apple.security.application-groups': ['group.com.dailyvocab.app'],
    },
  },
  android: {
    package: 'com.dailyvocab.app',
    adaptiveIcon: {
      backgroundColor: '#F7F3EA',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['@bacons/apple-targets'],
  extra: {
    splashBackground: '#F7F3EA',
  },
});
