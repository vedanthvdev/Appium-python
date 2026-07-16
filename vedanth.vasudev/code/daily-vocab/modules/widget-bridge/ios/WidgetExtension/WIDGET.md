# iOS WidgetKit (moved)

The Lock Screen / home widget now lives under the Expo Apple Targets folder:

`targets/DailyVocabWidget/`

That target is linked by `@bacons/apple-targets` during:

```bash
npx expo prebuild -p ios
```

Open Xcode (`xed ios`) and look for `expo:targets/DailyVocabWidget`.

Word catalogs are copied into `targets/DailyVocabWidget/assets/`. After regenerating content:

```bash
npm run content:sync-ios-widget
```
