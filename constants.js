// ===================================================================
// الثوابت المشتركة (Shared constants) — طبقة core
// ===================================================================
// نقطة حقيقية واحدة لكل مفاتيح localStorage وقيم الإعداد المشتركة بين
// أكثر من ملف. كانت هذه القيم موزّعة سابقًا: بعضها مكرر حرفيًا داخل
// <script> المضمّن أعلى index.html (لتفادي "flash" اللغة/الثيم)، وبعضها
// معرّف داخل app.js، وبعضها داخل exercises.js. أي تكرار لقيمة كسلسلة
// نصية حرفية في أكثر من مكان هو مصدر أخطاء صامتة إذا تغيّرت لاحقًا في
// مكان واحد فقط. هذا الملف يُحمَّل أولًا (قبل أي سكربت آخر، بما فيها
// السكربت المضمّن أعلى <head>) بحيث تبقى كل السكربتات الأخرى — الكلاسيكية
// بلا type="module" — تتشارك نفس النطاق المعجمي العلوي وتقرأ هذه القيم
// مباشرة، تمامًا كما كانت الثوابت السابقة معرّفة داخل app.js.
//
// لا تُغيّر أي قيمة هنا بلا التفكير فـ الترحيل (migration): تغيير مفتاح
// localStorage يعني فقدان بيانات كل المستخدمين الحاليين المخزّنة تحت
// المفتاح القديم.
// ===================================================================

const PROGRESS_KEY = "masar_progress_v2";        // مخطط جديد: يعتمد على lesson.id وليس رقم الترتيب
const LEGACY_PROGRESS_KEY = "masar_progress_v1"; // المخطط القديم، يُقرأ مرة واحدة فقط للترحيل
const PROGRESS_SCHEMA_VERSION = 2;
const STREAK_KEY = "masar_streak_v1";
const PREFS_KEY = "masar_prefs_v1";              // { goal: categoryId|null, level: "beginner"|"intermediate"|"advanced"|null, onboarded: true }
const PRACTICE_KEY = "masar_practice_v1";        // { [lessonId]: "user's free-text answer" }
const RETENTION_KEY = "masar_retention_v1";      // { [lessonId]: { nextDue: "YYYY-MM-DD", interval: 1, ease: 2.5, score: 0 } }
const HELPFUL_LOCAL_KEY = "masar_helpful_local_v1"; // { [lessonId]: true } — which lessons the user already voted helpful on
const QUIZ_KEY = "masar_quiz_v1";                // { [lessonId]: { optionId, correct, updatedAt } } — additive, does not touch PROGRESS_KEY
const LAST_VIEW_KEY = "masar_last_view_v1";
const DATA_BACKUP_KEY = "masar_last_export_v1";
const ACHIEVEMENTS_KEY = "masar_achievements_v1";
const ASSESSMENT_KEY = "masar_assessment_v1";
const CHALLENGE_CHECKLIST_KEY = "masar_challenge_checklist_v1";
const EXERCISES_KEY = "masar_exercises_v1";      // { [lessonId]: { [exerciseId]: { correct, answer, updatedAt } } }
const ANALYTICS_KEY = "masar_analytics_v1";
const ANALYTICS_MAX_EVENTS = 200;
const PROJECT_SUBMISSION_KEY = "masar_project_submissions_v1";
const MASTERED_SKILLS_NOTIFIED_KEY = "masar_mastered_notified_v1"; // { [catId::trackId]: true } — منع تكرار حدث skill_mastered لنفس المسار
const PATHS_COMPLETED_NOTIFIED_KEY = "masar_paths_completed_notified_v1"; // { [pathId]: true } — منع تكرار حدث path_completed
const DASHBOARD_COLLAPSE_KEY = "masar_dashboard_collapse_v1"; // { [panelId]: true } — أي لوحات فـ dashboard مطوية يدويًا من المستخدم

const THEME_KEY = "masar_theme_v1";
const LANG_KEY = "masar_lang_v1";
const SUPPORTED_LANGS = ["en", "ar", "ary", "fr", "es", "pt", "it", "de"];

// دعم Node (اختبارات الوحدة فـ tests/) بجانب المتصفح: فـ Node، module
// موجود فـ CommonJS، فنصدّر القيم بصيغة require(). فـ المتصفح، module
// غير معرّف أصلاً، فهذا الشرط يُتجاهل بصمت ولا يغيّر أي سلوك — القيم
// تبقى متغيرات عادية فـ النطاق العلوي المشترك بين كل السكربتات.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PROGRESS_KEY, LEGACY_PROGRESS_KEY, PROGRESS_SCHEMA_VERSION, STREAK_KEY,
    PREFS_KEY, PRACTICE_KEY, RETENTION_KEY, HELPFUL_LOCAL_KEY, QUIZ_KEY,
    LAST_VIEW_KEY, DATA_BACKUP_KEY, ACHIEVEMENTS_KEY, ASSESSMENT_KEY,
    CHALLENGE_CHECKLIST_KEY, EXERCISES_KEY, ANALYTICS_KEY, ANALYTICS_MAX_EVENTS,
    PROJECT_SUBMISSION_KEY, THEME_KEY, LANG_KEY, SUPPORTED_LANGS,
    MASTERED_SKILLS_NOTIFIED_KEY, PATHS_COMPLETED_NOTIFIED_KEY, DASHBOARD_COLLAPSE_KEY
  };
}
