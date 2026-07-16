# Daily Vocab

Simple Expo (React Native) app: pick **Beginner / Intermediate / Hard**, then see one random word per day on the lock screen with a one-line explanation.

## Status

| Area | State |
| --- | --- |
| Level chooser UI (animated) | Done |
| Daily random word domain + tests | Done |
| 1000×3 word catalogs + CI validate | Done (first ~20 real samples; rest generated placeholders — replace anytime) |
| Widget bridge (App Group / SharedPreferences) | Done |
| Android Glance widget + midnight worker | Done (needs native build) |
| iOS WidgetKit Lock Screen widget | Sources ready — add Xcode Widget Extension per `modules/widget-bridge/ios/WidgetExtension/WIDGET.md` |

## Requirements

- Node 20+
- Xcode + iOS Simulator (Mac) for `npm run ios`
- For lock-screen widgets: **dev client** / `expo prebuild` + native run. Expo Go runs the app UI; the local widget module is a safe no-op there.

## Scripts

```bash
npm install
npm start
npm run ios                       # Expo Go / simulator once Xcode is ready
npm run typecheck
npm test
npm run content:validate
npm run content:validate:strict
npm run content:generate          # expand catalogs to 1000 each
npm run content:sync-android      # copy JSON into Android assets
```

## Where you can run what

| Environment | What works |
| --- | --- |
| **This Linux cloud workspace** | `npm start`, tests, Android (with Android SDK). **Not** `expo run:ios`. |
| **Your Mac + Xcode Simulator** | Full iOS app + WidgetKit extension. |
| **EAS cloud** | `npx eas build -p ios` if you do not have a Mac build machine. |

## iPhone Simulator (on a Mac only)

From the **repo root**:

```bash
cd vedanth.vasudev/code/daily-vocab
npm install
export EXPO_APPLE_TEAM_ID=XXXXXXXXXX   # 10-char Team ID from Xcode → Settings → Accounts
npx expo prebuild -p ios
npx expo run:ios
```

If you are already inside `vedanth.vasudev/code/daily-vocab`, skip the `cd` (a second `cd vedanth.vasudev/code/daily-vocab` fails with “No such file or directory”).

Then: **Lock Screen → Customize → add Daily Vocab**.

## Native widgets

iOS WidgetKit target: `targets/DailyVocabWidget/` (`@bacons/apple-targets`).

```bash
npm run content:sync-ios-widget   # after editing content/words
npx expo run:android              # Linux/Mac with Android SDK
```

Details: `targets/DailyVocabWidget/README.md`  
Learner tip copy: `docs/widget-setup.md`.
