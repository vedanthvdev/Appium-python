package expo.modules.widgetbridge

import android.content.Context

object DailyVocabWidgetUpdater {
  fun requestUpdate(context: Context) {
    MidnightWordWorker.enqueueImmediate(context)
    MidnightWordWorker.schedule(context)
  }
}
