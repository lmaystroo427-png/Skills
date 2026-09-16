// ===================================================================
// اختبار انحدار (regression) على البيانات الحقيقية للمنصة
// ===================================================================
// بخلاف masar-logic.test.js (الذي يختبر المنطق بمعطيات وهمية صغيرة)،
// هذا الملف يُشغِّل نفس دوال السلامة على data.js الحقيقي كاملًا: كل
// فئة، كل مسار، كل درس المستخدم يراه فعليًا فـ التطبيق. هذا يلتقط بالضبط
// نوع الخطأ الذي حذّر منه validateSkillGraph فـ app.js أصلاً (معرّف
// متطلب سابق مكتوب خطأ، أو حلقة دائرية) — لكن الآن كجزء من CI/فحص
// تلقائي بدل الاعتماد فقط على console.warn يلاحظه أحد بالصدفة.
//
// تشغيل: node tests/skill-graph.real-data.test.js
// ===================================================================

const assert = require("assert");
const { validateSkillGraph, auditContentCompleteness } = require("./masar-logic.js");
const { SKILL_DATA, LEARNING_PATHS } = require("./data.js");

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

console.log("\nReal content integrity (data.js)");

test("SKILL_DATA is a non-empty array of categories", () => {
  assert.ok(Array.isArray(SKILL_DATA) && SKILL_DATA.length > 0);
});

test("validateSkillGraph finds zero orphaned prerequisites in the real content", () => {
  const result = validateSkillGraph(SKILL_DATA);
  assert.deepStrictEqual(result.orphanedRefs, [],
    `found prerequisite(s) pointing to a track that does not exist: ${JSON.stringify(result.orphanedRefs)}`);
});

test("validateSkillGraph finds zero circular prerequisite chains in the real content", () => {
  const result = validateSkillGraph(SKILL_DATA);
  assert.deepStrictEqual(result.cycles, [],
    `found circular prerequisite chain(s): ${JSON.stringify(result.cycles)}`);
});

test("every category id is unique", () => {
  const ids = SKILL_DATA.map(cat => cat.id);
  const unique = new Set(ids);
  assert.strictEqual(unique.size, ids.length, "duplicate category id detected");
});

test("every track id is unique across the whole platform (not just within its category)", () => {
  const ids = [];
  SKILL_DATA.forEach(cat => cat.tracks.forEach(trk => ids.push(trk.id)));
  const unique = new Set(ids);
  assert.strictEqual(unique.size, ids.length, "duplicate track id detected across categories");
});

test("every lesson id is unique across the whole platform", () => {
  // هذا حرج بالخصوص: progressRepository يخزّن التقدم بمعرّف الدرس مباشرة
  // (lesson.id)، فمعرّف درس مكرر بين مسارين مختلفين يعني أن إنجاز درس
  // فـ مسار واحد سيُعلَّم خطأً كمُنجَز فـ مسار آخر بلا علاقة به.
  const ids = [];
  SKILL_DATA.forEach(cat => cat.tracks.forEach(trk => trk.lessons.forEach(lesson => ids.push(lesson.id))));
  const seen = new Map();
  const duplicates = [];
  ids.forEach(id => {
    seen.set(id, (seen.get(id) || 0) + 1);
  });
  seen.forEach((count, id) => { if (count > 1) duplicates.push(id); });
  assert.deepStrictEqual(duplicates, [], `duplicate lesson id(s) detected: ${duplicates.join(", ")}`);
});

test("every track has at least one lesson", () => {
  const empties = [];
  SKILL_DATA.forEach(cat => cat.tracks.forEach(trk => {
    if (!trk.lessons || trk.lessons.length === 0) empties.push(`${cat.id}::${trk.id}`);
  }));
  assert.deepStrictEqual(empties, [], `track(s) with zero lessons: ${empties.join(", ")}`);
});

test("every lesson has an English title fallback (en is the universal fallback language)", () => {
  const missing = [];
  SKILL_DATA.forEach(cat => cat.tracks.forEach(trk => trk.lessons.forEach(lesson => {
    if (!lesson.title || !lesson.title.en) missing.push(lesson.id);
  })));
  assert.deepStrictEqual(missing, [], `lesson(s) missing an English title: ${missing.join(", ")}`);
});

test("every lesson's \"why\" field has a real translation in every supported language", () => {
  const report = auditContentCompleteness(SKILL_DATA);
  const gaps = {};
  report.supportedContentLanguages.forEach(lang => {
    if (report.whyMissingByLanguage[lang].length) gaps[lang] = report.whyMissingByLanguage[lang];
  });
  assert.deepStrictEqual(gaps, {}, `lesson(s) missing a "why" translation: ${JSON.stringify(gaps)}`);
});

test("every learning path step points to a track that actually exists", () => {
  if (typeof LEARNING_PATHS === "undefined") return; // optional feature, skip if absent
  const validTrackKeys = new Set();
  SKILL_DATA.forEach(cat => cat.tracks.forEach(trk => validTrackKeys.add(`${cat.id}::${trk.id}`)));
  const broken = [];
  LEARNING_PATHS.forEach(path => {
    path.steps.forEach(step => {
      const key = `${step.categoryId}::${step.trackId}`;
      if (!validTrackKeys.has(key)) broken.push(`${path.id}: ${key}`);
    });
  });
  assert.deepStrictEqual(broken, [], `learning path step(s) pointing to a missing track: ${broken.join(", ")}`);
});

// ---------------------------------------------------------------
// §38/§39: تقرير اكتمال المحتوى — إعلامي بحت (non-failing report).
// عمدًا لا نُفشل الاختبار على نقص "why": هذا عمل محتوى حقيقي (كتابة
// شروحات تربوية أصيلة)، لا خطأ برمجي. اختلاق شرح "لماذا" عام لكل درس
// فقط لرفع هذا الرقم يخالف §39 صراحة ("Do NOT generate filler"). هذا
// التقرير يجعل الفجوة مرئية وقابلة للتتبع بدل إخفائها.
// ---------------------------------------------------------------
console.log("\nContent completeness audit (data.js) — informational, not a pass/fail test");
const contentReport = auditContentCompleteness(SKILL_DATA);
console.log(`  Lessons: ${contentReport.totalLessons}`);
console.log(`  Completeness: ${contentReport.completenessPct}%`);
console.log(`  Missing "why" (motivation/rationale): ${contentReport.missingWhy.length}`);
console.log(`  Missing "explain" (core concept): ${contentReport.missingExplain.length}`);
console.log(`  Missing "tip" (practice prompt): ${contentReport.missingTip.length}`);
if (contentReport.missingExplain.length || contentReport.missingTip.length) {
  console.log("  ⚠ these two fields are expected on every lesson and should be treated as real gaps");
}

// ---------------------------------------------------------------
// تدقيق متعدد اللغات لـ "why": الفحص أعلاه (missingWhy) يتحقق فقط من
// وجود الحقل بأي لغة كانت، فيُبلّغ 100% حتى لو نقصت لغة بعينها. هذا
// القسم يميّز صراحة بين: (1) الحقل غائب كليًا، (2) لغة معينة ناقصة
// الترجمة، (3) ترجمة فارغة، (4) ترجمة فعلية موجودة — لكل لغة مدعومة.
// ---------------------------------------------------------------
console.log("\nMultilingual \"why\" completeness (all supported languages)");
contentReport.supportedContentLanguages.forEach(lang => {
  console.log(`  why.${lang}: ${contentReport.whyLanguageSummary[lang]}`);
});
console.log(`  why complete in all supported languages: ${contentReport.whyCompleteAllLanguagesSummary}`);
const totalMissingLangSlots = contentReport.supportedContentLanguages
  .reduce((sum, lang) => sum + contentReport.whyMissingByLanguage[lang].length, 0);
console.log(`  why missing languages (total gaps across all languages): ${totalMissingLangSlots}`);
if (totalMissingLangSlots > 0) {
  contentReport.supportedContentLanguages.forEach(lang => {
    const gaps = contentReport.whyMissingByLanguage[lang];
    if (gaps.length) console.log(`    ⚠ why.${lang} missing for: ${gaps.join(", ")}`);
  });
}

console.log(`\n${passed} passed, ${failed} failed (${passed + failed} total)`);
if (failed > 0) {
  console.log("\nFailed tests:");
  failures.forEach(({ name, err }) => console.log(`  - ${name}: ${err.message}`));
  process.exit(1);
} else {
  process.exit(0);
}
