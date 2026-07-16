import type { DailySnapshot } from './WidgetBridge.types';

const memory = new Map<string, string>();

export default {
  async setDailySnapshot(snapshot: DailySnapshot): Promise<void> {
    memory.set('dailySnapshot', JSON.stringify(snapshot));
  },
  async getDailySnapshot(): Promise<DailySnapshot | null> {
    const raw = memory.get('dailySnapshot');
    return raw ? (JSON.parse(raw) as DailySnapshot) : null;
  },
  async reloadWidgets(): Promise<void> {
    // no-op on web
  },
};
