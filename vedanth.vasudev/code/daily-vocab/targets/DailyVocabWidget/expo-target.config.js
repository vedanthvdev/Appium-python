/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: 'widget',
  name: 'DailyVocabWidget',
  displayName: 'Daily Vocab',
  deploymentTarget: '16.4',
  bundleIdentifier: '.DailyVocabWidget',
  frameworks: ['SwiftUI', 'WidgetKit'],
  colors: {
    $accent: '#2F6F4E',
    $widgetBackground: '#F7F3EA',
  },
  entitlements: {
    'com.apple.security.application-groups':
      config.ios?.entitlements?.['com.apple.security.application-groups'] ?? [
        'group.com.dailyvocab.app',
      ],
  },
});
