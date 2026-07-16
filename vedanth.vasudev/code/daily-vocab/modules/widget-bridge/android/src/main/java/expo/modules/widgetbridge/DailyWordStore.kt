package expo.modules.widgetbridge

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import kotlin.random.Random

data class DailySnapshot(
  val level: String,
  val localDate: String,
  val wordId: String,
  val word: String,
  val oneLiner: String,
)

data class CatalogWord(
  val id: String,
  val word: String,
  val oneLiner: String,
)

object DailyWordStore {
  const val PREFS = "dailyvocab_widget"
  const val SNAPSHOT_KEY = "dailySnapshot"
  const val LEVEL_KEY = "activeLevel"

  fun localDateString(now: Date = Date(), timeZone: TimeZone = TimeZone.getDefault()): String {
    val fmt = SimpleDateFormat("yyyy-MM-dd", Locale.US)
    fmt.timeZone = timeZone
    return fmt.format(now)
  }

  fun loadSnapshot(context: Context): DailySnapshot? {
    val raw = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .getString(SNAPSHOT_KEY, null) ?: return null
    return runCatching {
      val obj = JSONObject(raw)
      DailySnapshot(
        level = obj.getString("level"),
        localDate = obj.getString("localDate"),
        wordId = obj.getString("wordId"),
        word = obj.getString("word"),
        oneLiner = obj.getString("oneLiner"),
      )
    }.getOrNull()
  }

  fun saveSnapshot(context: Context, snapshot: DailySnapshot) {
    val obj = JSONObject()
      .put("level", snapshot.level)
      .put("localDate", snapshot.localDate)
      .put("wordId", snapshot.wordId)
      .put("word", snapshot.word)
      .put("oneLiner", snapshot.oneLiner)
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .edit()
      .putString(SNAPSHOT_KEY, obj.toString())
      .putString(LEVEL_KEY, snapshot.level)
      .apply()
  }

  fun loadCatalog(context: Context, level: String): List<CatalogWord> {
    val assetName = "words/$level.json"
    return runCatching {
      context.assets.open(assetName).bufferedReader().use { it.readText() }
        .let { JSONObject(it) }
        .getJSONArray("words")
        .toWordList()
    }.getOrDefault(emptyList())
  }

  fun ensureTodaysWord(
    level: String,
    words: List<CatalogWord>,
    state: DailySnapshot?,
    now: Date = Date(),
    randomInt: (Int) -> Int = { Random.nextInt(it) },
  ): DailySnapshot? {
    if (words.isEmpty()) return null
    val today = localDateString(now)
    if (state != null && state.localDate == today && state.level == level) {
      return state
    }

    var index = randomInt(words.size)
    val previous = state?.wordId
    if (words.size > 1 && previous != null) {
      var guard = 0
      while (words[index].id == previous && guard < 8) {
        index = randomInt(words.size)
        guard += 1
      }
      if (words[index].id == previous) {
        index = (index + 1) % words.size
      }
    }

    val entry = words[index]
    return DailySnapshot(
      level = level,
      localDate = today,
      wordId = entry.id,
      word = entry.word,
      oneLiner = entry.oneLiner,
    )
  }

  fun resolveForWidget(context: Context): DailySnapshot? {
    val existing = loadSnapshot(context)
    val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    val level = existing?.level ?: prefs.getString(LEVEL_KEY, null) ?: "beginner"
    val words = loadCatalog(context, level)
    val next = ensureTodaysWord(level, words, existing) ?: return existing
    if (next.wordId != existing?.wordId || next.localDate != existing.localDate) {
      saveSnapshot(context, next)
    }
    return next
  }
}

private fun JSONArray.toWordList(): List<CatalogWord> {
  val list = ArrayList<CatalogWord>(length())
  for (i in 0 until length()) {
    val obj = getJSONObject(i)
    list.add(
      CatalogWord(
        id = obj.getString("id"),
        word = obj.getString("word"),
        oneLiner = obj.getString("oneLiner"),
      ),
    )
  }
  return list
}
