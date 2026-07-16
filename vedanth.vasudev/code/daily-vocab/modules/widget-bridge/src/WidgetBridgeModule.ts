import { requireOptionalNativeModule } from 'expo';
import type { DailySnapshot } from './WidgetBridge.types';

type WidgetBridgeNative = {
  setDailySnapshot(snapshot: DailySnapshot): Promise<void>;
  getDailySnapshot(): Promise<DailySnapshot | null>;
  reloadWidgets(): Promise<void>;
};

/** Null in Expo Go / when the native module is not linked yet. */
const WidgetBridgeModule =
  requireOptionalNativeModule<WidgetBridgeNative>('WidgetBridge');

export default WidgetBridgeModule;
