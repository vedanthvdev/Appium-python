# DailyVocabWidget (WidgetKit)

Expo Apple Target for Lock Screen + home screen widgets.

## How it is wired

| Piece | Location |
| --- | --- |
| Widget UI + timeline | `DailyVocabWidget.swift` |
| App Group store + midnight pick | `DailyWordStore.swift` |
| Word JSON resources | `assets/*.json` |
| Target config | `expo-target.config.js` |
| RN → App Group write | `modules/widget-bridge` (`WidgetBridge`) |

App Group ID (must match everywhere): `group.com.dailyvocab.app`

## Generate the Xcode target

On a Mac with Xcode:

```bash
cd vedanth.vasudev/code/daily-vocab
# optional: set your team in app.config.ts → ios.appleTeamId
npx expo prebuild -p ios
xed ios
```

In Xcode you’ll see `expo:targets/DailyVocabWidget`. Select the widget scheme or the app scheme (widget builds with the app), run on Simulator, then:

**Lock Screen → Customize → Add Widget → Daily Vocab**

## Sync catalogs after content changes

```bash
npm run content:sync-ios-widget
```

Then rebuild the app so assets are copied into the extension bundle.
