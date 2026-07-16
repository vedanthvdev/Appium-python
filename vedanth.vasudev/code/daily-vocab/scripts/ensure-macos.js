#!/usr/bin/env node
/**
 * iOS native builds require macOS + Xcode. Fail fast with a clear message
 * when someone runs them on Linux (e.g. this cloud workspace).
 */
const task = process.argv[2] || 'this command';

if (process.platform !== 'darwin') {
  console.error(`
Cannot run "${task}" here.

This machine is ${process.platform} (not macOS).
Apple only allows building/running iOS apps on a Mac with Xcode.

What to do:
  1. On your Mac (with the iPhone Simulator installed):
       cd vedanth.vasudev/code/daily-vocab
       npm install
       npx expo prebuild -p ios
       npx expo run:ios

  2. Or use cloud builds:
       npx eas build -p ios

  3. Meanwhile on this Linux box you can still run the JS app:
       npm start
       # then open Expo Go on a physical phone, or wait for your Mac simulator

Note: if you are already inside vedanth.vasudev/code/daily-vocab, do NOT run
"cd vedanth.vasudev/code/daily-vocab" again — that path only exists from the repo root.
`);
  process.exit(1);
}
