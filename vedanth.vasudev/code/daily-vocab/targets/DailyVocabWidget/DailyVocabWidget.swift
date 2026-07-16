import SwiftUI
import WidgetKit

struct DailyVocabEntry: TimelineEntry {
  let date: Date
  let word: String
  let oneLiner: String
  let level: String
}

struct DailyVocabProvider: TimelineProvider {
  func placeholder(in context: Context) -> DailyVocabEntry {
    DailyVocabEntry(
      date: Date(),
      word: "happy",
      oneLiner: "Feeling joy or pleasure.",
      level: "beginner"
    )
  }

  func getSnapshot(in context: Context, completion: @escaping (DailyVocabEntry) -> Void) {
    completion(makeEntry(at: Date()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<DailyVocabEntry>) -> Void) {
    let now = Date()
    let midnight = DailyWordStore.nextMidnight(from: now)
    // Single entry for today; `.after(nextMidnight)` asks WidgetKit to reload at day change.
    let timeline = Timeline(entries: [makeEntry(at: now)], policy: .after(midnight))
    completion(timeline)
  }

  private func makeEntry(at date: Date) -> DailyVocabEntry {
    let snapshot = DailyWordStore.resolveForWidget(now: date)
    return DailyVocabEntry(
      date: date,
      word: snapshot?.word ?? "Daily Vocab",
      oneLiner: snapshot?.oneLiner ?? "Pick a level in the app",
      level: snapshot?.level ?? "beginner"
    )
  }
}

struct DailyVocabWidgetView: View {
  @Environment(\.widgetFamily) var family
  var entry: DailyVocabEntry

  var body: some View {
    switch family {
    case .accessoryInline:
      Text("\(entry.word) — \(entry.oneLiner)")
    case .accessoryCircular:
      ZStack {
        AccessoryWidgetBackground()
        Text(String(entry.word.prefix(6)))
          .font(.caption2.weight(.bold))
          .minimumScaleFactor(0.5)
          .multilineTextAlignment(.center)
          .padding(2)
      }
    case .accessoryRectangular:
      VStack(alignment: .leading, spacing: 2) {
        Text(entry.word)
          .font(.headline)
          .fontWeight(.bold)
          .minimumScaleFactor(0.7)
          .lineLimit(1)
        Text(entry.oneLiner)
          .font(.caption)
          .lineLimit(2)
          .minimumScaleFactor(0.8)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    default:
      VStack(alignment: .leading, spacing: 6) {
        Text(entry.level.uppercased())
          .font(.caption2.weight(.semibold))
          .foregroundStyle(.secondary)
        Text(entry.word)
          .font(.title2.weight(.bold))
          .minimumScaleFactor(0.7)
          .lineLimit(1)
        Text(entry.oneLiner)
          .font(.subheadline)
          .foregroundStyle(.secondary)
          .lineLimit(3)
          .minimumScaleFactor(0.85)
        Spacer(minLength: 0)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
  }
}

@main
struct DailyVocabWidget: Widget {
  let kind = "DailyVocabWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: DailyVocabProvider()) { entry in
      if #available(iOS 17.0, *) {
        DailyVocabWidgetView(entry: entry)
          .containerBackground(for: .widget) {
            Color.clear
          }
          .widgetURL(URL(string: "dailyvocab://today"))
      } else {
        DailyVocabWidgetView(entry: entry)
          .padding()
          .widgetURL(URL(string: "dailyvocab://today"))
      }
    }
    .configurationDisplayName("Daily Vocab")
    .description("One word a day with a short meaning.")
    .supportedFamilies([
      .accessoryRectangular,
      .accessoryInline,
      .accessoryCircular,
      .systemSmall,
      .systemMedium,
    ])
  }
}
