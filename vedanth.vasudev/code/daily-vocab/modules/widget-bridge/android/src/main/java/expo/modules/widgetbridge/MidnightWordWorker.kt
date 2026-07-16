package expo.modules.widgetbridge

import android.content.Context
import androidx.glance.appwidget.updateAll
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import java.util.Calendar
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MidnightWordWorker(
  appContext: Context,
  params: WorkerParameters,
) : CoroutineWorker(appContext, params) {
  override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
    DailyWordStore.resolveForWidget(applicationContext)
    DailyVocabGlanceWidget().updateAll(applicationContext)
    Result.success()
  }

  companion object {
    private const val UNIQUE = "dailyvocab_midnight"
    private const val UNIQUE_NOW = "dailyvocab_update_now"

    fun enqueueImmediate(context: Context) {
      val req = OneTimeWorkRequestBuilder<MidnightWordWorker>().build()
      WorkManager.getInstance(context)
        .enqueueUniqueWork(UNIQUE_NOW, ExistingWorkPolicy.REPLACE, req)
    }

    fun schedule(context: Context) {
      val delayMinutes = minutesUntilNextLocalMidnight().coerceAtLeast(1)
      val periodic = PeriodicWorkRequestBuilder<MidnightWordWorker>(12, TimeUnit.HOURS)
        .setInitialDelay(delayMinutes, TimeUnit.MINUTES)
        .build()
      WorkManager.getInstance(context).enqueueUniquePeriodicWork(
        UNIQUE,
        ExistingPeriodicWorkPolicy.UPDATE,
        periodic,
      )
    }

    private fun minutesUntilNextLocalMidnight(): Long {
      val now = Calendar.getInstance()
      val next = Calendar.getInstance().apply {
        add(Calendar.DAY_OF_YEAR, 1)
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 5)
        set(Calendar.MILLISECOND, 0)
      }
      return ((next.timeInMillis - now.timeInMillis) / 60000L)
    }
  }
}
