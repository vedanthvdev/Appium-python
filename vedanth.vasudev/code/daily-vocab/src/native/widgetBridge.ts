import type { DailyState } from '../domain/types';
import WidgetBridgeModule from '../../modules/widget-bridge/src/WidgetBridgeModule';

export type DailySnapshot = {
  level: string;
  localDate: string;
  wordId: string;
  word: string;
  oneLiner: string;
};

function toSnapshot(state: DailyState): DailySnapshot {
  return {
    level: state.level,
    localDate: state.localDate,
    wordId: state.wordId,
    word: state.word,
    oneLiner: state.oneLiner,
  };
}

/** Persist today's word for native widgets. Safe no-op in Expo Go. */
export async function pushDailySnapshot(state: DailyState): Promise<void> {
  if (!WidgetBridgeModule) return;
  try {
    await WidgetBridgeModule.setDailySnapshot(toSnapshot(state));
    await WidgetBridgeModule.reloadWidgets();
  } catch {
    // Native calls can fail before a widget is installed — ignore.
  }
}

export async function readDailySnapshot(): Promise<DailySnapshot | null> {
  if (!WidgetBridgeModule) return null;
  try {
    return await WidgetBridgeModule.getDailySnapshot();
  } catch {
    return null;
  }
}
