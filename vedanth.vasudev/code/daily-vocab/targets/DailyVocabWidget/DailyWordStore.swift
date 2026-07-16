import Foundation

struct DailySnapshot: Codable, Equatable {
  let level: String
  let localDate: String
  let wordId: String
  let word: String
  let oneLiner: String
}

struct CatalogWord: Codable {
  let id: String
  let word: String
  let oneLiner: String
}

struct CatalogFile: Codable {
  let version: Int
  let level: String
  let words: [CatalogWord]
}

/// Shared with the React Native host via App Group `group.com.dailyvocab.app`.
enum DailyWordStore {
  static let suiteName = "group.com.dailyvocab.app"
  static let snapshotKey = "dailySnapshot"
  static let levelKey = "activeLevel"

  static var defaults: UserDefaults {
    UserDefaults(suiteName: suiteName) ?? .standard
  }

  static func localDateString(now: Date = Date(), timeZone: TimeZone = .current) -> String {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = timeZone
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: now)
  }

  static func loadSnapshot() -> DailySnapshot? {
    guard let json = defaults.string(forKey: snapshotKey),
          let data = json.data(using: .utf8) else { return nil }
    return try? JSONDecoder().decode(DailySnapshot.self, from: data)
  }

  static func saveSnapshot(_ snapshot: DailySnapshot) {
    guard let data = try? JSONEncoder().encode(snapshot),
          let json = String(data: data, encoding: .utf8) else { return }
    defaults.set(json, forKey: snapshotKey)
    defaults.set(snapshot.level, forKey: levelKey)
    defaults.synchronize()
  }

  static func loadCatalog(level: String, bundle: Bundle = .main) -> [CatalogWord] {
    // Files live in target assets/ and are copied as bundle resources.
    if let url = bundle.url(forResource: level, withExtension: "json"),
       let data = try? Data(contentsOf: url),
       let file = try? JSONDecoder().decode(CatalogFile.self, from: data) {
      return file.words
    }
    return []
  }

  /// Mirrors TypeScript `ensureTodaysWord` persistence rules.
  static func ensureTodaysWord(
    level: String,
    words: [CatalogWord],
    state: DailySnapshot?,
    now: Date = Date(),
    randomInt: (Int) -> Int = { Int.random(in: 0..<$0) }
  ) -> DailySnapshot? {
    guard !words.isEmpty else { return nil }
    let today = localDateString(now: now)
    if let state, state.localDate == today, state.level == level {
      return state
    }

    var index = randomInt(words.count)
    if words.count > 1, let previous = state?.wordId {
      var guardCount = 0
      while words[index].id == previous && guardCount < 8 {
        index = randomInt(words.count)
        guardCount += 1
      }
      if words[index].id == previous {
        index = (index + 1) % words.count
      }
    }

    let entry = words[index]
    return DailySnapshot(
      level: level,
      localDate: today,
      wordId: entry.id,
      word: entry.word,
      oneLiner: entry.oneLiner
    )
  }

  static func resolveForWidget(now: Date = Date(), bundle: Bundle = .main) -> DailySnapshot? {
    let existing = loadSnapshot()
    let level = existing?.level ?? defaults.string(forKey: levelKey) ?? "beginner"
    let words = loadCatalog(level: level, bundle: bundle)
    guard let next = ensureTodaysWord(level: level, words: words, state: existing, now: now) else {
      return existing
    }
    if next != existing {
      saveSnapshot(next)
    }
    return next
  }

  static func nextMidnight(from date: Date = Date(), calendar: Calendar = .current) -> Date {
    let start = calendar.startOfDay(for: date)
    return calendar.date(byAdding: .day, value: 1, to: start) ?? date.addingTimeInterval(86_400)
  }
}
