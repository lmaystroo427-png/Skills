// ===================================================================
// اختبارات وحدة (unit tests) لمنطق مسار الأساسي
// ===================================================================
// بدون أي إطار اختبار خارجي (لا Jest، لا Mocha) — المشروع vanilla بلا
// build step، فالاختبارات تبقى وفية لنفس الفلسفة: ملف JS عادي يُشغَّل
// مباشرة بـ Node، بلا أي تثبيت (npm install). كل اختبار دالة صغيرة
// assert() ترمي خطأ واضحًا عند الفشل بدل مجرد console.log.
//
// طريقة التشغيل:
//   node tests/masar-logic.test.js
//
// أو افتح tests.html في متصفح لرؤية نفس الاختبارات تُشغَّل مباشرة فـ
// DOM (بلا Node إطلاقًا) — مفيد لأن المشروع النهائي يُنشر كموقع ثابت
// بلا Node على الخادم.
// ===================================================================

const assert = require("assert");
const {
  getLocalDateKey, addDays, normalizeStreak, computeNextStreak,
  progressPercent, computeLevel, xpForLevel,
  isValidProgressState, migrateLegacyProgress, validateSkillGraph,
  scoreTrackAgainstSearch, levenshteinDistance, fuzzyWordMatch,
  countConsecutiveFailedAttempts, normalizeAssessmentHistory, computeFailurePriorityBoost,
  computeRetentionScore, interleaveByKey, auditContentCompleteness,
  getIncompleteLessonPrerequisites, validateLessonGraph, scorePathAgainstSearch
} = require("./masar-logic.js");

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, err });
    console.log(`  ✗ ${name}`);
    console.log(`      ${err.message}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

// ---------------------------------------------------------------
section("getLocalDateKey / addDays");
// ---------------------------------------------------------------

test("getLocalDateKey formats as YYYY-MM-DD with zero-padding", () => {
  const d = new Date(2026, 0, 5); // 5 Jan 2026 (month is 0-indexed)
  assert.strictEqual(getLocalDateKey(d), "2026-01-05");
});

test("getLocalDateKey pads double-digit month and day correctly (no off-by-one)", () => {
  const d = new Date(2026, 10, 23); // 23 Nov 2026
  assert.strictEqual(getLocalDateKey(d), "2026-11-23");
});

test("addDays moves forward across a month boundary", () => {
  assert.strictEqual(addDays("2026-01-31", 1), "2026-02-01");
});

test("addDays moves backward across a year boundary", () => {
  assert.strictEqual(addDays("2026-01-01", -1), "2025-12-31");
});

test("addDays is safe across a leap-day (2028 is a leap year)", () => {
  assert.strictEqual(addDays("2028-02-28", 1), "2028-02-29");
  assert.strictEqual(addDays("2028-02-29", 1), "2028-03-01");
});

// ---------------------------------------------------------------
section("normalizeStreak (legacy data migration)");
// ---------------------------------------------------------------

test("normalizeStreak returns a zeroed streak for null/garbage input", () => {
  assert.deepStrictEqual(normalizeStreak(null), { count: 0, lastDate: null });
  assert.deepStrictEqual(normalizeStreak("not an object"), { count: 0, lastDate: null });
});

test("normalizeStreak passes through an already-correct YYYY-MM-DD date untouched", () => {
  const result = normalizeStreak({ count: 4, lastDate: "2026-03-10" });
  assert.deepStrictEqual(result, { count: 4, lastDate: "2026-03-10" });
});

test("normalizeStreak converts a legacy toDateString() value to YYYY-MM-DD", () => {
  const result = normalizeStreak({ count: 2, lastDate: "Mon Jan 05 2026" });
  assert.strictEqual(result.lastDate, "2026-01-05");
  assert.strictEqual(result.count, 2);
});

test("normalizeStreak falls back to null for an unparsable legacy date", () => {
  const result = normalizeStreak({ count: 1, lastDate: "not-a-real-date" });
  assert.strictEqual(result.lastDate, null);
});

// ---------------------------------------------------------------
section("computeNextStreak (streak bump logic)");
// ---------------------------------------------------------------

test("computeNextStreak starts a new streak at 1 for a first-ever activity", () => {
  const result = computeNextStreak({ count: 0, lastDate: null }, "2026-05-10");
  assert.deepStrictEqual(result, { count: 1, lastDate: "2026-05-10" });
});

test("computeNextStreak increments when the previous day was exactly yesterday", () => {
  const result = computeNextStreak({ count: 5, lastDate: "2026-05-09" }, "2026-05-10");
  assert.deepStrictEqual(result, { count: 6, lastDate: "2026-05-10" });
});

test("computeNextStreak resets to 1 after a gap of more than one day", () => {
  const result = computeNextStreak({ count: 8, lastDate: "2026-05-01" }, "2026-05-10");
  assert.deepStrictEqual(result, { count: 1, lastDate: "2026-05-10" });
});

test("computeNextStreak does not double-count the same calendar day", () => {
  const result = computeNextStreak({ count: 3, lastDate: "2026-05-10" }, "2026-05-10");
  assert.deepStrictEqual(result, { count: 3, lastDate: "2026-05-10" });
});

// ---------------------------------------------------------------
section("progressPercent / XP curve");
// ---------------------------------------------------------------

test("progressPercent handles the zero-total case without dividing by zero", () => {
  assert.strictEqual(progressPercent(0, 0), 0);
});

test("progressPercent rounds to the nearest whole percent", () => {
  assert.strictEqual(progressPercent(1, 3), 33);
  assert.strictEqual(progressPercent(2, 3), 67);
  assert.strictEqual(progressPercent(5, 5), 100);
});

test("xpForLevel(1) requires zero XP (level 1 is the starting level)", () => {
  assert.strictEqual(xpForLevel(1), 0);
});

test("computeLevel(0) is level 1, never level 0", () => {
  assert.strictEqual(computeLevel(0), 1);
});

test("computeLevel and xpForLevel agree with each other (round-trip)", () => {
  for (let level = 1; level <= 10; level++) {
    const xpNeeded = xpForLevel(level);
    assert.ok(computeLevel(xpNeeded) >= level, `level ${level} should be reached at ${xpNeeded} XP`);
  }
});

test("computeLevel never decreases as XP increases (monotonic)", () => {
  let lastLevel = 1;
  for (let xp = 0; xp <= 5000; xp += 50) {
    const level = computeLevel(xp);
    assert.ok(level >= lastLevel, `level dropped at xp=${xp}`);
    lastLevel = level;
  }
});

// ---------------------------------------------------------------
section("isValidProgressState / migrateLegacyProgress (data safety)");
// ---------------------------------------------------------------

test("isValidProgressState rejects null, arrays, and wrong-version objects", () => {
  assert.strictEqual(isValidProgressState(null, 2), false);
  assert.strictEqual(isValidProgressState([], 2), false);
  assert.strictEqual(isValidProgressState({ version: 1, tracks: {} }, 2), false);
});

test("isValidProgressState accepts a well-formed v2 state", () => {
  assert.strictEqual(isValidProgressState({ version: 2, tracks: {} }, 2), true);
});

test("migrateLegacyProgress converts index-based completion to id-based completion", () => {
  const fakeTrack = {
    id: "js-basics",
    lessons: [{ id: "js-basics-l1" }, { id: "js-basics-l2" }, { id: "js-basics-l3" }]
  };
  const findTrackStub = (categoryId, trackId) => {
    if (categoryId === "programming" && trackId === "js-basics") {
      return { category: { id: "programming" }, track: fakeTrack };
    }
    return null;
  };
  // legacy shape: completion keyed by lesson INDEX (0, 2), not lesson id
  const legacy = { "programming::js-basics": { 0: true, 2: true } };
  const migrated = migrateLegacyProgress(legacy, findTrackStub, 2);

  assert.strictEqual(migrated.version, 2);
  const entry = migrated.tracks["programming::js-basics"];
  assert.ok(entry, "migrated entry should exist");
  assert.deepStrictEqual(entry.completedLessons, { "js-basics-l1": true, "js-basics-l3": true });
});

test("migrateLegacyProgress silently skips tracks that no longer exist (renamed/removed)", () => {
  const findTrackStub = () => null; // simulate: track was deleted from data.js
  const legacy = { "programming::deleted-track": { 0: true } };
  const migrated = migrateLegacyProgress(legacy, findTrackStub, 2);
  assert.deepStrictEqual(migrated.tracks, {});
});

test("migrateLegacyProgress returns an empty-but-valid state for garbage input", () => {
  const migrated = migrateLegacyProgress(null, () => null, 2);
  assert.deepStrictEqual(migrated, { version: 2, tracks: {} });
});

// ---------------------------------------------------------------
section("validateSkillGraph (content integrity)");
// ---------------------------------------------------------------

function makeSkillData() {
  return [
    {
      id: "programming",
      tracks: [
        { id: "js-basics", prerequisites: [] },
        { id: "js-advanced", prerequisites: ["js-basics"] }
      ]
    }
  ];
}

test("validateSkillGraph finds no issues in a clean, acyclic graph", () => {
  const result = validateSkillGraph(makeSkillData());
  assert.deepStrictEqual(result.orphanedRefs, []);
  assert.deepStrictEqual(result.cycles, []);
});

test("validateSkillGraph flags a prerequisite pointing to a track that does not exist", () => {
  const data = makeSkillData();
  data[0].tracks[1].prerequisites = ["this-track-does-not-exist"];
  const result = validateSkillGraph(data);
  assert.strictEqual(result.orphanedRefs.length, 1);
  assert.ok(result.orphanedRefs[0].includes("this-track-does-not-exist"));
});

test("validateSkillGraph detects a direct A-requires-B-requires-A cycle", () => {
  const data = makeSkillData();
  data[0].tracks[0].prerequisites = ["js-advanced"]; // js-basics now requires js-advanced too
  const result = validateSkillGraph(data);
  assert.ok(result.cycles.length >= 1, "expected at least one cycle to be detected");
});

test("validateSkillGraph detects a longer 3-node cycle (A -> B -> C -> A)", () => {
  const data = [{
    id: "cat",
    tracks: [
      { id: "a", prerequisites: ["c"] },
      { id: "b", prerequisites: ["a"] },
      { id: "c", prerequisites: ["b"] }
    ]
  }];
  const result = validateSkillGraph(data);
  assert.ok(result.cycles.length >= 1, "expected the 3-node cycle to be detected");
});

// ---------------------------------------------------------------
section("scoreTrackAgainstSearch (shelf search)");
// ---------------------------------------------------------------

const trStub = (obj) => (obj && typeof obj === "object" ? (obj.en || "") : (obj || ""));

function makeSearchFixture() {
  const category = { name: { en: "Programming" } };
  const track = {
    title: { en: "JavaScript Fundamentals" },
    summary: { en: "Variables, functions, and flow control." },
    lessons: [
      { title: { en: "Variables and data types" } },
      { title: { en: "Loops" } }
    ]
  };
  return { category, track };
}

test("scoreTrackAgainstSearch returns 0 for an empty query (matches everything with no boost)", () => {
  const { category, track } = makeSearchFixture();
  assert.strictEqual(scoreTrackAgainstSearch(category, track, [], trStub), 0);
});

test("scoreTrackAgainstSearch scores higher when the token starts the title vs. appears mid-title", () => {
  const { category, track } = makeSearchFixture();
  const startsWithScore = scoreTrackAgainstSearch(category, track, ["javascript"], trStub);
  const midTitleScore = scoreTrackAgainstSearch(category, track, ["fundamentals"], trStub);
  assert.ok(startsWithScore > midTitleScore, "a title-prefix match should outscore a mid-title match");
});

test("scoreTrackAgainstSearch matches a token that only appears in a lesson title", () => {
  const { category, track } = makeSearchFixture();
  const score = scoreTrackAgainstSearch(category, track, ["loops"], trStub);
  assert.ok(score !== null && score > 0, "should match via the lesson title field");
});

test("scoreTrackAgainstSearch requires ALL tokens to match somewhere (AND across tokens)", () => {
  const { category, track } = makeSearchFixture();
  const score = scoreTrackAgainstSearch(category, track, ["javascript", "nonexistentword"], trStub);
  assert.strictEqual(score, null, "one unmatched token should exclude the whole track");
});

test("scoreTrackAgainstSearch matches a token found only in the category name", () => {
  const { category, track } = makeSearchFixture();
  const score = scoreTrackAgainstSearch(category, track, ["programming"], trStub);
  assert.ok(score !== null && score > 0);
});

// ---------------------------------------------------------------
section("fuzzy search fallback (§22)");
// ---------------------------------------------------------------

test("levenshteinDistance is 0 for identical strings and counts single-letter typos", () => {
  assert.strictEqual(levenshteinDistance("loops", "loops"), 0);
  assert.strictEqual(levenshteinDistance("loops", "lopps"), 1);
});

test("fuzzyWordMatch finds a one-letter-off word but ignores short tokens entirely", () => {
  assert.ok(fuzzyWordMatch("javascript fundamentals", "javascrpt"));
  assert.ok(!fuzzyWordMatch("javascript fundamentals", "css")); // too short to fuzzy-match safely
});

test("scoreTrackAgainstSearch recovers a misspelled token via the fuzzy fallback, scoring lower than an exact hit", () => {
  const { category, track } = makeSearchFixture();
  const exactScore = scoreTrackAgainstSearch(category, track, ["javascript"], trStub);
  const typoScore = scoreTrackAgainstSearch(category, track, ["javascrpt"], trStub);
  assert.ok(typoScore !== null, "a one-letter typo should still match via fuzzy fallback");
  assert.ok(typoScore < exactScore, "fuzzy match should score lower than an exact match");
});

test("scoreTrackAgainstSearch still excludes a track when even the fuzzy fallback finds nothing close", () => {
  const { category, track } = makeSearchFixture();
  const score = scoreTrackAgainstSearch(category, track, ["xylophone"], trStub);
  assert.strictEqual(score, null);
});

// ---------------------------------------------------------------
section("countConsecutiveFailedAttempts (repeated-failure signal, §14)");
// ---------------------------------------------------------------

test("countConsecutiveFailedAttempts returns 0 for an empty or missing history", () => {
  assert.strictEqual(countConsecutiveFailedAttempts([]), 0);
  assert.strictEqual(countConsecutiveFailedAttempts(null), 0);
});

test("countConsecutiveFailedAttempts returns 0 when the most recent attempt passed", () => {
  const attempts = [{ passed: false }, { passed: false }, { passed: true }];
  assert.strictEqual(countConsecutiveFailedAttempts(attempts), 0);
});

test("countConsecutiveFailedAttempts counts a streak of failures ending at the most recent attempt", () => {
  const attempts = [{ passed: true }, { passed: false }, { passed: false }];
  assert.strictEqual(countConsecutiveFailedAttempts(attempts), 2);
});

test("countConsecutiveFailedAttempts stops counting at the first success looking backward", () => {
  const attempts = [{ passed: false }, { passed: true }, { passed: false }, { passed: false }];
  assert.strictEqual(countConsecutiveFailedAttempts(attempts), 2);
});

test("countConsecutiveFailedAttempts also understands the {correct} shape used by quizzes", () => {
  const attempts = [{ correct: false }, { correct: false }];
  assert.strictEqual(countConsecutiveFailedAttempts(attempts), 2);
});

// ---------------------------------------------------------------
section("normalizeAssessmentHistory (migration to attempt history, §14)");
// ---------------------------------------------------------------

test("normalizeAssessmentHistory returns an empty object for garbage input", () => {
  assert.deepStrictEqual(normalizeAssessmentHistory(null), {});
  assert.deepStrictEqual(normalizeAssessmentHistory("nope"), {});
});

test("normalizeAssessmentHistory wraps a legacy single-result entry into a one-attempt history", () => {
  const legacy = { "js-basics": { passed: false, pct: 40 } };
  const migrated = normalizeAssessmentHistory(legacy);
  assert.strictEqual(migrated["js-basics"].attempts.length, 1);
  assert.strictEqual(migrated["js-basics"].latest.pct, 40);
});

test("normalizeAssessmentHistory passes through an already-migrated entry, defensively copied", () => {
  const attempts = [{ passed: false }, { passed: true }];
  const already = { "js-basics": { attempts, latest: attempts[1] } };
  const migrated = normalizeAssessmentHistory(already);
  assert.strictEqual(migrated["js-basics"].attempts.length, 2);
  migrated["js-basics"].attempts.push({ passed: false });
  assert.strictEqual(attempts.length, 2, "the original array must not be mutated");
});

// ---------------------------------------------------------------
section("computeFailurePriorityBoost (prerequisite-first recommendation, §14)");
// ---------------------------------------------------------------

test("computeFailurePriorityBoost does not prioritize a track with no assessment history", () => {
  const result = computeFailurePriorityBoost({}, "js-basics");
  assert.strictEqual(result.shouldPrioritize, false);
  assert.strictEqual(result.failCount, 0);
});

test("computeFailurePriorityBoost does not prioritize after a single failure (below threshold)", () => {
  const history = normalizeAssessmentHistory({ "js-basics": { passed: false } });
  const result = computeFailurePriorityBoost(history, "js-basics");
  assert.strictEqual(result.shouldPrioritize, false);
  assert.strictEqual(result.failCount, 1);
});

test("computeFailurePriorityBoost prioritizes after two consecutive failures — the exact §14 example", () => {
  const attempts = [{ passed: false }, { passed: false }];
  const history = { "js-basics": { attempts, latest: attempts[1] } };
  const result = computeFailurePriorityBoost(history, "js-basics");
  assert.strictEqual(result.shouldPrioritize, true);
  assert.strictEqual(result.failCount, 2);
});

test("computeFailurePriorityBoost resets priority once the user finally passes", () => {
  const attempts = [{ passed: false }, { passed: false }, { passed: true }];
  const history = { "js-basics": { attempts, latest: attempts[2] } };
  const result = computeFailurePriorityBoost(history, "js-basics");
  assert.strictEqual(result.shouldPrioritize, false);
  assert.strictEqual(result.failCount, 0);
});

// ---------------------------------------------------------------
section("computeRetentionScore (§6: real retention component)");
// ---------------------------------------------------------------

test("computeRetentionScore returns null when no lessons are completed yet", () => {
  const lessons = [{ id: "l1" }, { id: "l2" }];
  assert.strictEqual(computeRetentionScore(lessons, {}, {}), null);
});

test("computeRetentionScore returns null when completed lessons have no review history yet", () => {
  const lessons = [{ id: "l1" }, { id: "l2" }];
  const completed = { l1: true, l2: true };
  assert.strictEqual(computeRetentionScore(lessons, completed, {}), null);
});

test("computeRetentionScore counts a lesson as healthy when ease and interval look strong", () => {
  const lessons = [{ id: "l1" }];
  const completed = { l1: true };
  const retention = { l1: { ease: 2.6, interval: 6 } };
  const result = computeRetentionScore(lessons, completed, retention);
  assert.strictEqual(result.pct, 100);
  assert.strictEqual(result.reviewedCount, 1);
});

test("computeRetentionScore counts a lesson as unhealthy when ease dropped below the threshold (repeated forgetting)", () => {
  const lessons = [{ id: "l1" }];
  const completed = { l1: true };
  const retention = { l1: { ease: 1.4, interval: 1 } };
  const result = computeRetentionScore(lessons, completed, retention);
  assert.strictEqual(result.pct, 0);
});

test("computeRetentionScore only scores lessons that were actually reviewed, not merely completed", () => {
  const lessons = [{ id: "l1" }, { id: "l2" }];
  const completed = { l1: true, l2: true };
  const retention = { l1: { ease: 2.6, interval: 6 } }; // l2 completed but never reviewed
  const result = computeRetentionScore(lessons, completed, retention);
  assert.strictEqual(result.reviewedCount, 1);
  assert.strictEqual(result.totalCompleted, 2);
  assert.strictEqual(result.pct, 100);
});

// ---------------------------------------------------------------
section("interleaveByKey (§40: interleaving instead of blocking by skill)");
// ---------------------------------------------------------------

test("interleaveByKey returns short lists untouched", () => {
  const items = [{ k: "a" }];
  assert.deepStrictEqual(interleaveByKey(items, i => i.k), items);
});

test("interleaveByKey never places two same-key items back-to-back when another key is available", () => {
  const items = [
    { k: "js", n: 1 }, { k: "js", n: 2 }, { k: "js", n: 3 },
    { k: "python", n: 1 }
  ];
  const result = interleaveByKey(items, i => i.k);
  assert.strictEqual(result.length, 4);
  for (let i = 1; i < result.length; i++) {
    if (result[i].k === result[i - 1].k) {
      // Only acceptable once the other key's queue is fully exhausted.
      const remainingOtherKey = result.slice(i).some(it => it.k !== result[i].k);
      assert.ok(!remainingOtherKey, "same key repeated back-to-back while another key still had items left");
    }
  }
});

test("interleaveByKey preserves every original item (no drops, no duplicates)", () => {
  const items = [{ k: "a", id: 1 }, { k: "b", id: 2 }, { k: "a", id: 3 }, { k: "c", id: 4 }];
  const result = interleaveByKey(items, i => i.k);
  const originalIds = items.map(i => i.id).sort();
  const resultIds = result.map(i => i.id).sort();
  assert.deepStrictEqual(resultIds, originalIds);
});

// ---------------------------------------------------------------
section("auditContentCompleteness (§38/§39: honest content-gap reporting, no filler)");
// ---------------------------------------------------------------

test("auditContentCompleteness reports 100% when every lesson has why/explain/tip", () => {
  const data = [{ id: "cat", tracks: [{ id: "trk", lessons: [
    { id: "l1", why: "x", explain: "x", tip: "x" }
  ] }] }];
  const report = auditContentCompleteness(data);
  assert.strictEqual(report.completenessPct, 100);
  assert.deepStrictEqual(report.missingWhy, []);
});

test("auditContentCompleteness flags a lesson missing 'why' by its full path", () => {
  const data = [{ id: "cat", tracks: [{ id: "trk", lessons: [
    { id: "l1", explain: "x", tip: "x" } // no why
  ] }] }];
  const report = auditContentCompleteness(data);
  assert.deepStrictEqual(report.missingWhy, ["cat::trk::l1"]);
  assert.deepStrictEqual(report.missingExplain, []);
});

// ---------------------------------------------------------------
section("getIncompleteLessonPrerequisites (§5: lesson-level soft prerequisites)");
// ---------------------------------------------------------------

test("case 1: a lesson with no 'requires' field returns an empty list", () => {
  const lesson = { id: "l2" };
  const all = [{ id: "l1" }, { id: "l2" }];
  assert.deepStrictEqual(getIncompleteLessonPrerequisites(lesson, all, {}), []);
});

test("case 2: a lesson with one incomplete prerequisite returns that lesson", () => {
  const lesson = { id: "l2", requires: ["l1"] };
  const all = [{ id: "l1", title: "First" }, lesson];
  const result = getIncompleteLessonPrerequisites(lesson, all, {});
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, "l1");
});

test("case 3: multiple prerequisites are all returned when none are completed", () => {
  const lesson = { id: "l3", requires: ["l1", "l2"] };
  const all = [{ id: "l1" }, { id: "l2" }, lesson];
  const result = getIncompleteLessonPrerequisites(lesson, all, {});
  assert.strictEqual(result.length, 2);
});

test("case 4: a prerequisite id that doesn't exist in allLessons is silently skipped, not a crash", () => {
  const lesson = { id: "l2", requires: ["does-not-exist"] };
  const all = [lesson];
  assert.doesNotThrow(() => getIncompleteLessonPrerequisites(lesson, all, {}));
  assert.deepStrictEqual(getIncompleteLessonPrerequisites(lesson, all, {}), []);
});

test("case 6: prerequisites that are all completed return an empty list", () => {
  const lesson = { id: "l2", requires: ["l1"] };
  const all = [{ id: "l1" }, lesson];
  const completed = { l1: true };
  assert.deepStrictEqual(getIncompleteLessonPrerequisites(lesson, all, completed), []);
});

test("case 7: only the incomplete subset of several prerequisites is returned", () => {
  const lesson = { id: "l3", requires: ["l1", "l2"] };
  const all = [{ id: "l1" }, { id: "l2" }, lesson];
  const completed = { l1: true }; // l2 still incomplete
  const result = getIncompleteLessonPrerequisites(lesson, all, completed);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, "l2");
});

test("getIncompleteLessonPrerequisites never throws for a null/undefined lesson", () => {
  assert.doesNotThrow(() => getIncompleteLessonPrerequisites(null, [], {}));
  assert.deepStrictEqual(getIncompleteLessonPrerequisites(null, [], {}), []);
});

// ---------------------------------------------------------------
section("validateLessonGraph (§5: lesson-level graph integrity)");
// ---------------------------------------------------------------

function makeLessonSkillData() {
  return [{
    id: "cat", tracks: [{
      id: "trk",
      lessons: [
        { id: "l1" },
        { id: "l2", requires: ["l1"] },
        { id: "l3", requires: ["l1", "l2"] }
      ]
    }]
  }];
}

test("case 5 (orphan): a 'requires' id that does not exist in the same track is flagged, not a crash", () => {
  const data = makeLessonSkillData();
  data[0].tracks[0].lessons[1].requires = ["this-lesson-does-not-exist"];
  const result = validateLessonGraph(data);
  assert.strictEqual(result.orphanedRefs.length, 1);
  assert.ok(result.orphanedRefs[0].includes("this-lesson-does-not-exist"));
  assert.deepStrictEqual(result.cycles, []);
});

test("case 5 (circular): a direct two-lesson cycle is detected, not an infinite loop", () => {
  const data = makeLessonSkillData();
  data[0].tracks[0].lessons[0].requires = ["l2"]; // l1 <-> l2
  const result = validateLessonGraph(data);
  assert.ok(result.cycles.length >= 1, "expected at least one cycle to be detected");
});

test("validateLessonGraph finds no issues on a clean chain of lesson requirements", () => {
  const result = validateLessonGraph(makeLessonSkillData());
  assert.deepStrictEqual(result.orphanedRefs, []);
  assert.deepStrictEqual(result.cycles, []);
});

test("validateLessonGraph treats lessons with no 'requires' field as trivially valid", () => {
  const data = [{ id: "cat", tracks: [{ id: "trk", lessons: [{ id: "l1" }, { id: "l2" }] }] }];
  const result = validateLessonGraph(data);
  assert.deepStrictEqual(result.orphanedRefs, []);
  assert.deepStrictEqual(result.cycles, []);
});

// ---------------------------------------------------------------
section("scorePathAgainstSearch (§22: learning paths included in search)");
// ---------------------------------------------------------------

function makePathFixture() {
  return {
    title: { en: "Become a Web Developer" },
    description: { en: "From JavaScript fundamentals to a real interface." }
  };
}

test("scorePathAgainstSearch returns 0 for an empty query", () => {
  assert.strictEqual(scorePathAgainstSearch(makePathFixture(), [], trStub), 0);
});

test("scorePathAgainstSearch matches a token in the path title", () => {
  const score = scorePathAgainstSearch(makePathFixture(), ["developer"], trStub);
  assert.ok(score !== null && score > 0);
});

test("scorePathAgainstSearch matches a token only found in the description", () => {
  const score = scorePathAgainstSearch(makePathFixture(), ["javascript"], trStub);
  assert.ok(score !== null && score > 0);
});

test("scorePathAgainstSearch excludes a path when a token matches nothing, even via fuzzy fallback", () => {
  const score = scorePathAgainstSearch(makePathFixture(), ["xylophone"], trStub);
  assert.strictEqual(score, null);
});

// ---------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed (${passed + failed} total)`);
if (failed > 0) {
  console.log("\nFailed tests:");
  failures.forEach(({ name, err }) => console.log(`  - ${name}: ${err.message}`));
  process.exit(1);
} else {
  process.exit(0);
}
