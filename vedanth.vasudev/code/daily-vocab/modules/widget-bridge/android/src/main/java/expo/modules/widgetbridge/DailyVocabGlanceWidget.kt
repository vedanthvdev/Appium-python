package expo.modules.widgetbridge

import android.content.Context
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import android.graphics.Color as AndroidColor

class DailyVocabGlanceWidget : GlanceAppWidget() {
  override suspend fun provideGlance(context: Context, id: GlanceId) {
    val snapshot = DailyWordStore.resolveForWidget(context)
    val word = snapshot?.word ?: "Daily Vocab"
    val oneLiner = snapshot?.oneLiner ?: "Open the app and pick a level"

    provideContent {
      Column(
        modifier = GlanceModifier
          .fillMaxSize()
          .background(ColorProvider(AndroidColor.parseColor("#F7F3EA")))
          .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalAlignment = Alignment.Start,
      ) {
        Text(
          text = word,
          style = TextStyle(fontWeight = FontWeight.Bold, fontSize = 18.sp),
        )
        Text(
          text = oneLiner,
          style = TextStyle(fontSize = 13.sp),
          modifier = GlanceModifier.padding(top = 4.dp),
        )
      }
    }
  }
}

class DailyVocabGlanceWidgetReceiver : GlanceAppWidgetReceiver() {
  override val glanceAppWidget: GlanceAppWidget = DailyVocabGlanceWidget()

  companion object {
    @JvmStatic
    fun requestUpdate(context: Context) {
      DailyVocabGlanceWidget().let { widget ->
        // updateAll is a suspend extension — enqueue via worker-friendly call
        MidnightWordWorker.enqueueImmediate(context)
      }
    }
  }
}
