// ===================================================================
// ثوابت وإعدادات عامة
// ===================================================================
// إعادة هيكلة (modularization): كل الثوابت (مفاتيح localStorage، اللغات
// المدعومة...) انتقلت إلى js/core/constants.js، وهو أول ملف يُحمَّل فـ
// index.html. بما أن كل السكربتات هنا كلاسيكية (بلا type="module")،
// فهي تتشارك نفس النطاق المعجمي العلوي، فـ PROGRESS_KEY وSTREAK_KEY
// وغيرها تبقى متاحة هنا مباشرة بلا أي import — بالضبط كما كانت من قبل،
// فقط معرّفة الآن فـ مكان واحد بدل التكرار الحرفي بين app.js والسكربت
// المضمّن أعلى index.html.
//
// كذلك دوال المنطق النقي (getLocalDateKey، addDays، normalizeStreak،
// progressPercent، computeLevel، xpForLevel، isValidProgressState،
// migrateLegacyProgress، validateSkillGraph، scoreTrackAgainstSearch،
// computeRetentionScore، interleaveByKey، auditContentCompleteness)
// انتقلت إلى js/core/masar-logic.js لتصبح قابلة للاختبار بمعزل عن
// المتصفح (انظر tests/masar-logic.test.js). سلوكها هنا لم يتغيّر إطلاقًا.

// ===================================================================
// أداة صغيرة لبناء عناصر DOM بأمان (بدون innerHTML) — النصوص القادمة
// من البيانات تُمرَّر دائمًا عبر textContent، لذا لا يمكن أن تتحول إلى
// HTML قابل للتنفيذ حتى لو أصبح المحتوى قادمًا من مستخدمين/CMS لاحقًا.
// ===================================================================
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  });
  (Array.isArray(children) ? children : [children]).forEach(child => {
    if (child == null) return;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return node;
}

function debounce(fn, waitMs) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

// ===================================================================
// اللغة والترجمة
// ===================================================================
function loadLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return SUPPORTED_LANGS.includes(saved) ? saved : "en";
  } catch (e) {
    return "en";
  }
}

let currentLang = loadLanguage();

function isRtlLanguage(lang) {
  return lang === "ar" || lang === "ary";
}

function t(key, variables = {}) {
  const strings = UI_STRINGS[key] || {};
  const template = strings[currentLang] || strings.en || key;
  return Object.keys(variables).reduce(
    (text, name) => text.replaceAll(`{${name}}`, variables[name]),
    template
  );
}

function tr(obj) {
  if (typeof obj === "string") return obj;
  // إصلاح: tr(undefined) أو tr(null) كان يُسقط التطبيق بأكمله (crash) بدل
  // إظهار نص فارغ. أي حقل محتوى مفقود عن طريق الخطأ (مثال: lesson بلا title
  // فـ لغة معينة) ما خاصوش يوقف كامل الصفحة.
  if (!obj || typeof obj !== "object") return "";
  return obj[currentLang] || obj.en || "";
}

// ===================================================================
// طبقة الوصول إلى المحتوى (Content repository)
// اليوم تُرجع بيانات SKILL_DATA الثابتة مباشرة؛ لاحقًا يمكن استبدال
// تطبيقها الداخلي بنداء API دون تغيير أي كود في طبقة العرض.
// ===================================================================
function findTrack(categoryId, trackId) {
  const category = SKILL_DATA.find(c => c.id === categoryId);
  if (!category) return null;
  const track = category.tracks.find(trk => trk.id === trackId);
  return { category, track };
}

// يبحث عن مسار (track) بمعرّفه فقط، بغض النظر عن الفئة التي ينتمي إليها.
// مفيد للمتطلبات المسبقة (prerequisites)، التي يمكن أن تشير إلى مسار في
// فئة مختلفة عن المسار الحالي.
function findTrackAnywhere(trackId) {
  for (const category of SKILL_DATA) {
    const track = category.tracks.find(trk => trk.id === trackId);
    if (track) return { category, track };
  }
  return null;
}

// ===================================================================
// مخطط المهارات (Skill graph) — كل مسار يحمل الآن prerequisites (قائمة
// معرّفات مسارات يُستحسن إنجازها قبله) و estimatedMinutes (تقدير رقمي
// للوقت، منفصل عن نص duration المترجم). هذا حقل بيانات إضافي بحت: لا
// يغيّر أي شيء في مخطط التقدم المحفوظ (progressRepository)، لذلك لا
// حاجة لأي ترحيل (migration) لبيانات المستخدمين الحاليين.
//
// ما يحتاج فعلاً إلى حماية هو سلامة هذا المخطط نفسه: معرّف متطلب سابق
// مكتوب خطأ، أو حلقة متطلبات دائرية (A يتطلب B وB يتطلب A)، قد يكسر
// المنطق بصمت. validateSkillGraph (منقولة الآن إلى js/core/masar-logic.js
// لتصبح قابلة للاختبار) تتحقق من هذا عند الإقلاع وتحذّر في console فقط
// (لا تُظهر شيئًا للمستخدم ولا توقف التطبيق أبدًا).
// ===================================================================

// يرجع قائمة المسارات المطلوبة كمتطلب سابق لمسار معيّن ولم تُنجَز بعد
// (أي نسبة إنجازها أقل من 100%). لا تمنع المستخدم من فتح المسار — فقط
// معلومة إرشادية غير حاجبة (soft prerequisite)، لأن كل درس في مسار
// قائم بذاته وقابل للقراءة بشكل مستقل. تُحسب مباشرة من progressRepository
// الحالي، فلا حاجة لتمرير أي حالة إضافية عبر سلسلة الاستدعاءات.
function getIncompletePrerequisites(track) {
  return (track.prerequisites || [])
    .map(prereqId => findTrackAnywhere(prereqId))
    .filter(Boolean)
    .filter(({ category, track: prereqTrack }) => {
      const done = countDone(category.id, prereqTrack.id, prereqTrack.lessons);
      return prereqTrack.lessons.length === 0 || done < prereqTrack.lessons.length;
    });
}

// ===================================================================
// طبقة تخزين التقدم (Progress repository)
// المخطط: { version: 2, tracks: { "catId::trackId": { completedLessons: { lessonId: true }, updatedAt } } }
// التخزين بمعرّف الدرس الثابت (lesson.id) يحل المشكلة الحرجة: كان
// التقدم القديم مرتبطًا برقم ترتيب الدرس، فأي إضافة/حذف/إعادة ترتيب
// كانت تُفسد تقدم كل مستخدم سابق.
// ===================================================================
function defaultProgressState() {
  return { version: PROGRESS_SCHEMA_VERSION, tracks: {} };
}

// isValidProgressState وmigrateLegacyProgress منقولتان الآن إلى
// js/core/masar-logic.js (قابلتان للاختبار فـ Node)، بنفس السلوك تمامًا.
// ما زالتا مُستدعاتان هنا بالاسم مباشرة لأن كل السكربتات تتشارك نفس
// النطاق العلوي، وjs/core/masar-logic.js يُحمَّل قبل هذا الملف.

function persistProgressState(state) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent("masar:progressSaved", { detail: state }));
    return true;
  } catch (e) {
    showToast(t("saveError"));
    return false;
  }
}

function loadProgressState() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidProgressState(parsed)) return parsed;
    }
  } catch (e) {
    // بيانات تالفة تحت المفتاح الجديد: نكمل ونحاول الترحيل من القديم أو نبدأ من جديد.
  }

  try {
    const legacyRaw = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (legacyRaw) {
      const migrated = migrateLegacyProgress(JSON.parse(legacyRaw));
      persistProgressState(migrated);
      return migrated;
    }
  } catch (e) {
    // بيانات قديمة تالفة أيضًا: لا داعي لإيقاف التطبيق، نبدأ بحالة افتراضية.
  }

  return defaultProgressState();
}

const progressRepository = {
  state: loadProgressState(),

  reload() {
    this.state = loadProgressState();
  },

  trackKey(categoryId, trackId) {
    return `${categoryId}::${trackId}`;
  },

  getCompletedLessons(categoryId, trackId) {
    const entry = this.state.tracks[this.trackKey(categoryId, trackId)];
    return entry ? entry.completedLessons : {};
  },

  setLessonDone(categoryId, trackId, lessonId, done) {
    const key = this.trackKey(categoryId, trackId);
    if (!this.state.tracks[key]) this.state.tracks[key] = { completedLessons: {}, updatedAt: Date.now() };
    if (done) this.state.tracks[key].completedLessons[lessonId] = true;
    else delete this.state.tracks[key].completedLessons[lessonId];
    this.state.tracks[key].updatedAt = Date.now();
    return persistProgressState(this.state);
  },

  resetTrack(categoryId, trackId) {
    delete this.state.tracks[this.trackKey(categoryId, trackId)];
    return persistProgressState(this.state);
  },

  resetAll() {
    this.state = defaultProgressState();
    persistProgressState(this.state);
  },

  exportData() {
    return JSON.stringify({
      schema: "masar-full-v1",
      exportedAt: new Date().toISOString(),
      version: this.state.version,
      progress: this.state,
      prefs: userPrefs,
      streak: currentStreak,
      practice: loadPracticeNotes(),
      retention: loadRetentionState(),
      helpful: loadLocalHelpfulVotes(),
      quiz: loadQuizState(),
      assessment: loadAssessmentState(),
      achievements: loadUnlockedAchievements(),
      theme: document.documentElement.getAttribute("data-theme") || "light",
      lang: currentLang
    }, null, 2);
  },

  // مُحصَّنة: تتحقق من شكل كل إدخال قبل قبوله، وترفض المفاتيح الخطرة
  // (__proto__ / constructor / prototype) لمنع أي احتمال لتلوّث الـ
  // prototype عبر ملف مستورد.
  importData(jsonText) {
    const parsed = JSON.parse(jsonText);
    const progressSource = parsed && parsed.progress ? parsed.progress : parsed;
    if (!isValidProgressState(progressSource)) throw new Error("Invalid Masar progress file");

    const tracks = {};
    Object.keys(progressSource.tracks).forEach(trackKey => {
      if (trackKey === "__proto__" || trackKey === "constructor" || trackKey === "prototype") return;
      const entry = progressSource.tracks[trackKey];
      if (!entry || typeof entry !== "object" || Array.isArray(entry)
        || !entry.completedLessons || typeof entry.completedLessons !== "object"
        || Array.isArray(entry.completedLessons)) return;
      tracks[trackKey] = {
        ...entry,
        completedLessons: { ...entry.completedLessons }
      };
    });

    this.state = { version: progressSource.version || PROGRESS_SCHEMA_VERSION, tracks };
    persistProgressState(this.state);

    if (parsed && parsed.prefs && typeof parsed.prefs === "object") {
      userPrefs = { ...loadPrefs(), ...parsed.prefs };
      savePrefs(userPrefs);
    }
    if (parsed && parsed.streak && typeof parsed.streak === "object") {
      currentStreak = normalizeStreak(parsed.streak);
      try { localStorage.setItem(STREAK_KEY, JSON.stringify(currentStreak)); } catch (e) {}
    }
    if (parsed && parsed.practice && typeof parsed.practice === "object") {
      try { localStorage.setItem(PRACTICE_KEY, JSON.stringify(parsed.practice)); } catch (e) {}
    }
    if (parsed && parsed.retention && typeof parsed.retention === "object") {
      try { localStorage.setItem(RETENTION_KEY, JSON.stringify(parsed.retention)); } catch (e) {}
    }
    if (parsed && parsed.helpful && typeof parsed.helpful === "object") {
      try { localStorage.setItem(HELPFUL_LOCAL_KEY, JSON.stringify(parsed.helpful)); } catch (e) {}
    }
    if (parsed && parsed.achievements && typeof parsed.achievements === "object") {
      try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(parsed.achievements)); } catch (e) {}
    }
    if (parsed && parsed.assessment && typeof parsed.assessment === "object") {
      try { localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(parsed.assessment)); } catch (e) {}
    }
    if (parsed && typeof parsed.theme === "string" && (parsed.theme === "light" || parsed.theme === "dark")) {
      document.documentElement.setAttribute("data-theme", parsed.theme);
      try { localStorage.setItem(THEME_KEY, parsed.theme); } catch (e) {}
    }
    if (parsed && typeof parsed.lang === "string" && SUPPORTED_LANGS.includes(parsed.lang)) {
      currentLang = parsed.lang;
      try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) {}
      applyLanguageUI();
    }
  }
};

// ===================================================================
// الستريك — الحساب النقي (getLocalDateKey، addDays، normalizeStreak،
// computeNextStreak) منقول الآن إلى js/core/masar-logic.js ومُختبر هناك
// (tests/masar-logic.test.js). هذا يفصل "ما يجب أن يصبح عليه الستريك"
// (منطق قابل للاختبار بمعزل عن التخزين) عن "قراءته وكتابته فـ localStorage
// وعرض toast" (أثر جانبي، يبقى هنا لأنه يحتاج DOM/localStorage فعليين).
// ===================================================================
function loadStreak() {
  try {
    return normalizeStreak(JSON.parse(localStorage.getItem(STREAK_KEY)));
  } catch (e) {
    return { count: 0, lastDate: null };
  }
}

function bumpStreak() {
  const previous = loadStreak();
  const today = getLocalDateKey();
  const streak = computeNextStreak(previous, today);
  if (streak.lastDate === previous.lastDate && streak.count === previous.count) {
    return streak; // مُحتسب اليوم بالفعل
  }
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch (e) {
    showToast(t("saveError"));
  }
  currentStreak = streak;
  return streak;
}

// ===================================================================
// التخصيص (Personalization) — هدف تعليمي + مستوى، لبناء رف "موصى به لك"
// بدون أي خادم: كل شيء محسوب من نفس SKILL_DATA وتقدم المستخدم المحلي.
// ===================================================================
function loadPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY));
    return raw && typeof raw === "object" ? raw : { goal: null, level: null, onboarded: false };
  } catch (e) {
    return { goal: null, level: null, onboarded: false };
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    // تفضيلات غير محفوظة لا يجب أن توقف التطبيق.
  }
}

let userPrefs = loadPrefs();
// timePerDay بالدقائق: يُستعمل لبناء "قائمة اليوم" (computeDailyQueue) بحجم
// واقعي بدل قائمة ثابتة الطول لكل المستخدمين. القيم الممكنة: 10/20/40.
const TIME_PER_DAY_OPTIONS = [10, 20, 40];
let onboardingSelection = { goal: userPrefs.goal, level: userPrefs.level, timePerDay: userPrefs.timePerDay || 20 };

function renderOnboardingOptions() {
  const goalWrap = document.getElementById("onboardingGoalOptions");
  goalWrap.replaceChildren();
  SKILL_DATA.forEach(cat => {
    const chip = el("button", {
      type: "button",
      class: "onboarding-chip" + (onboardingSelection.goal === cat.id ? " selected" : ""),
      text: tr(cat.name),
      onclick: () => { onboardingSelection.goal = cat.id; renderOnboardingOptions(); }
    });
    goalWrap.appendChild(chip);
  });

  const levelWrap = document.getElementById("onboardingLevelOptions");
  levelWrap.replaceChildren();
  ["beginner", "intermediate", "advanced"].forEach(level => {
    const labels = TRACK_LEVEL_LABELS[level];
    const chip = el("button", {
      type: "button",
      class: "onboarding-chip" + (onboardingSelection.level === level ? " selected" : ""),
      text: labels[currentLang] || labels.en,
      onclick: () => { onboardingSelection.level = level; renderOnboardingOptions(); }
    });
    levelWrap.appendChild(chip);
  });

  const timeWrap = document.getElementById("onboardingTimeOptions");
  if (timeWrap) {
    timeWrap.replaceChildren();
    TIME_PER_DAY_OPTIONS.forEach(minutes => {
      const chip = el("button", {
        type: "button",
        class: "onboarding-chip" + (onboardingSelection.timePerDay === minutes ? " selected" : ""),
        text: t("timePerDayOption", { minutes }),
        onclick: () => { onboardingSelection.timePerDay = minutes; renderOnboardingOptions(); }
      });
      timeWrap.appendChild(chip);
    });
  }
}

function openOnboarding() {
  onboardingSelection = { goal: userPrefs.goal, level: userPrefs.level, timePerDay: userPrefs.timePerDay || 20 };
  renderOnboardingOptions();
  document.getElementById("onboardingOverlay").classList.remove("hidden");
}

function closeOnboarding() {
  document.getElementById("onboardingOverlay").classList.add("hidden");
}

function collectTrackWeakness(categoryId, trackId, track) {
  const completed = progressRepository.getCompletedLessons(categoryId, trackId);
  const notes = loadPracticeNotes();
  const weakLessons = [];

  track.lessons.forEach(lesson => {
    const isCompleted = !!completed[lesson.id];
    const hasPractice = !!(notes[lesson.id] && notes[lesson.id].trim().length > 0);
    if (!isCompleted || !hasPractice) weakLessons.push({ lesson, isCompleted, hasPractice });
  });

  if (!weakLessons.length) return null;
  const first = weakLessons[0];
  return {
    lesson: first.lesson,
    reason: first.isCompleted ? t("weaknessPracticeMissing") : t("weaknessConceptIncomplete"),
    remaining: weakLessons.length
  };
}

function computeRecommendationReason(category, track, info) {
  const mastery = computeTrackMastery(category.id, track.id, track);
  const weakness = collectTrackWeakness(category.id, track.id, track);
  const currentTrackIndex = category.tracks.findIndex(item => item.id === track.id);
  const previousTrack = currentTrackIndex > 0 ? category.tracks[currentTrackIndex - 1] : null;
  const failStreak = getAssessmentFailureStreak(track.id);

  // §14 (تطبيق حرفي للمثال: "User failed D twice → recommend C before E"):
  // فشل حقيقي ومتكرر (مرتين متتاليتين أو أكثر) فـ الاختبار النهائي لهذا
  // المسار تحديدًا هو إشارة أقوى من أي توصية أخرى — بما فيها "واصل" أو
  // "يطابق هدفك" — لأنه يعني أن المستخدم لم يُتقن هذا المسار فعليًا
  // رغم إنهاء دروسه. هذا يُرجَّح أولًا (قبل كل الشروط الأخرى) ويُستعمل
  // أيضًا لترجيح نقاط المسار فـ computeRecommendedTracks أدناه.
  if (failStreak >= 2) {
    return t("recReasonFailedRepeatedly", { count: failStreak });
  }
  if (info.done > 0 && info.done < info.total) {
    return t("recReasonContinue", { done: info.done, total: info.total });
  }
  if (userPrefs.goal && category.id === userPrefs.goal) {
    return t("recReasonGoal", { category: tr(category.name) });
  }
  if (previousTrack && countDone(category.id, previousTrack.id, previousTrack.lessons) === previousTrack.lessons.length) {
    return t("recReasonNextUp", { title: tr(previousTrack.title) });
  }
  if (weakness) {
    return t("recReasonWeakness", { title: tr(weakness.lesson.title), remaining: weakness.remaining });
  }
  if (mastery && mastery.overallPct >= 60) {
    return t("recReasonReady", { pct: mastery.overallPct });
  }
  if (userPrefs.level && track.level === userPrefs.level) {
    return t("recReasonLevel", { level: TRACK_LEVEL_LABELS[track.level][currentLang] || TRACK_LEVEL_LABELS[track.level].en });
  }
  return t("recReasonGeneral");
}

function computeRecommendedTracks(summary, maxCount = 6) {
  const candidates = [];
  const dueReviews = getDueReviews(10);
  const reviewHitTrackIds = new Set(dueReviews.map(item => `${item.category.id}::${item.track.id}`));

  SKILL_DATA.forEach(cat => {
    cat.tracks.forEach(track => {
      const info = summary.perTrack.get(`${cat.id}::${track.id}`);
      if (!info) return;
      const failStreak = getAssessmentFailureStreak(track.id);
      const isFinished = info.total > 0 && info.done === info.total;
      // مسار مكتمل الدروس عادة يُستبعد من التوصيات — إلا إذا كان
      // المستخدم يفشل بشكل متكرر فـ اختباره النهائي (§14): إتمام الدروس
      // بلا اجتياز الاختبار ليس إتقانًا حقيقيًا، فيستحق مسارًا توصية.
      if (isFinished && failStreak < 2) return;
      const reason = computeRecommendationReason(cat, track, info);
      const weakness = collectTrackWeakness(cat.id, track.id, track);
      const mastery = computeTrackMastery(cat.id, track.id, track);
      const dueBoost = reviewHitTrackIds.has(`${cat.id}::${track.id}`) ? 3 : 0;
      let score = 0;
      if (userPrefs.goal && cat.id === userPrefs.goal) score += 2;
      if (userPrefs.level && track.level === userPrefs.level) score += 1;
      if (info.done > 0) score += 3;
      if (weakness) score += 2;
      if (mastery && mastery.overallPct >= 60) score += 2;
      if (dueBoost) score += dueBoost;
      // ترجيح أعلى من أي مكوّن آخر (بما فيها المراجعة المستحقة)، عمدًا:
      // فشل حقيقي مرتين فـ اختبار نهائي دليل أقوى على الحاجة الفعلية من
      // مجرد جدولة تكرار متباعد نظرية.
      if (failStreak >= 2) score += 5;
      candidates.push({ category: cat, track, info, score, reason });
    });
  });
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, maxCount);
}

function renderRecommended(summary) {
  const section = document.getElementById("recommendedSection");
  const row = document.getElementById("recommendedRow");
  if (!userPrefs.onboarded) {
    section.classList.add("hidden");
    return;
  }
  const picks = computeRecommendedTracks(summary);
  row.replaceChildren();
  picks.forEach(({ category, track, info, reason }) => {
    row.appendChild(buildBookCard(category, track, info, reason));
  });
  section.classList.toggle("hidden", picks.length === 0);
}

function loadRetentionState() {
  try {
    const raw = JSON.parse(localStorage.getItem(RETENTION_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function saveRetentionState(state) {
  try {
    localStorage.setItem(RETENTION_KEY, JSON.stringify(state));
  } catch (e) {
    // no-op; retention is a helpful feature, not a blocker
  }
}

function scheduleLessonReview(lessonId, score = 3, intervalOverride = null) {
  const state = loadRetentionState();
  const current = state[lessonId] || { nextDue: getLocalDateKey(), interval: 1, ease: 2.5, score: 0 };
  const nextInterval = intervalOverride != null ? intervalOverride : Math.max(1, Math.round((current.interval || 1) * (current.ease || 2.5) * (score / 3)));
  const nextDue = addDays(getLocalDateKey(), Math.max(1, nextInterval));
  state[lessonId] = {
    nextDue,
    interval: nextInterval,
    ease: Math.max(1.3, (current.ease || 2.5) + (score >= 4 ? 0.15 : score <= 2 ? -0.2 : 0)),
    score: Math.max(0, Math.min(5, score)),
    updatedAt: Date.now()
  };
  saveRetentionState(state);
  return state[lessonId];
}

function getDueReviews(limit = 3) {
  const state = loadRetentionState();
  const today = getLocalDateKey();
  const due = [];

  SKILL_DATA.forEach(cat => {
    cat.tracks.forEach(track => {
      track.lessons.forEach(lesson => {
        const entry = state[lesson.id];
        if (!entry) {
          if (progressRepository.getCompletedLessons(cat.id, track.id)[lesson.id]) {
            due.push({ category: cat, track, lesson, nextDue: today, dueIn: 0, reason: t("reviewReasonFollowUp") });
          }
          return;
        }
        if (entry.nextDue <= today) {
          due.push({ category: cat, track, lesson, nextDue: entry.nextDue, dueIn: 0, reason: t("reviewReasonFollowUp") });
        }
      });
    });
  });

  // §40: تدخيل (interleaving) بدل الترتيب الأبجدي الخام. الترتيب
  // الأبجدي السابق كان يُنتج كتلًا متتالية من نفس المسار حين يتراكم
  // عدة دروس مستحقة لنفس المهارة (blocking) — بعكس ما تُظهره أبحاث
  // علوم التعلّم من أن تبديل المواضيع (interleaving) يحسّن الاستيعاب
  // طويل المدى مقارنة بمراجعة نفس الموضوع دفعة واحدة. الترتيب الأبجدي
  // يبقى مستعملاً فقط كترتيب ابتدائي مستقر داخل كل مجموعة (بدل ترتيب
  // اعتباطي حسب ترتيب الاكتشاف فـ SKILL_DATA).
  due.sort((a, b) => a.lesson.title.en.localeCompare(b.lesson.title.en));
  const interleaved = interleaveByKey(due, item => `${item.category.id}::${item.track.id}`);
  return interleaved.slice(0, limit);
}

function renderReviewQueue() {
  const section = document.getElementById("reviewSection");
  const queue = document.getElementById("reviewQueue");
  if (!queue || !section) return;

  const dueReviews = getDueReviews(3);
  queue.replaceChildren();

  if (!dueReviews.length) {
    section.classList.add("hidden");
    return;
  }

  const title = document.getElementById("reviewTitle");
  if (title) title.textContent = t("reviewTitle");

  dueReviews.forEach(item => {
    const row = el("div", { class: "review-item" }, [
      el("div", { class: "review-item-main" }, [
        el("span", { class: "review-item-track", text: `${tr(item.category.name)} · ${tr(item.track.title)}` }),
        el("strong", { class: "review-item-lesson", text: tr(item.lesson.title) })
      ]),
      el("div", { class: "review-item-meta" }, [
        el("span", { class: "review-item-badge", text: t("reviewDueToday") }),
        el("span", { class: "review-item-reason", text: item.reason })
      ])
    ]);
    queue.appendChild(row);
  });

  section.classList.remove("hidden");
}

function buildSkillMapForTrack(categoryId, trackId, track) {
  const category = SKILL_DATA.find(cat => cat.id === categoryId);
  const categoryTracks = category ? category.tracks : [];
  const currentIndex = categoryTracks.findIndex(item => item.id === trackId);
  const mastery = computeTrackMastery(categoryId, trackId, track);
  const completed = progressRepository.getCompletedLessons(categoryId, trackId);
  const notes = loadPracticeNotes();
  const weakness = collectTrackWeakness(categoryId, trackId, track);

  const prerequisites = [];
  for (let i = 0; i < currentIndex; i++) {
    const prevTrack = categoryTracks[i];
    const prevDone = countDone(categoryId, prevTrack.id, prevTrack.lessons);
    if (prevTrack.lessons.length && prevDone < prevTrack.lessons.length) {
      prerequisites.push(prevTrack);
    }
  }

  const nextTrack = categoryTracks.slice(currentIndex + 1).find(item => {
    const done = countDone(categoryId, item.id, item.lessons);
    return item.lessons.length > 0 && done < item.lessons.length;
  }) || categoryTracks.find(item => item.id !== trackId && countDone(categoryId, item.id, item.lessons) < item.lessons.length);

  const remainingLessons = track.lessons.filter(lesson => !completed[lesson.id]).length;
  const projectText = mastery && mastery.overallPct >= 60
    ? t("skillMapProjectReady", { title: tr(track.title) })
    : t("skillMapProjectPractice", { title: tr(track.title), remaining: remainingLessons });

  return {
    mastery,
    weaknesses: weakness ? [weakness] : [],
    prerequisites,
    nextTrack,
    projectText,
    currentSkill: tr(track.title),
    currentCategory: category ? tr(category.name) : ""
  };
}

function renderSkillMap(categoryId, trackId, track) {
  const wrap = document.getElementById("skillMapWrap");
  if (!wrap) return;

  const map = buildSkillMapForTrack(categoryId, trackId, track);
  const skillMapNodes = [
    { label: t("skillMapCurrent"), value: map.currentSkill },
    {
      label: t("skillMapPrerequisites"),
      value: map.prerequisites.length
        ? map.prerequisites.map(item => tr(item.title)).join(" • ")
        : t("skillMapNoPrerequisites")
    },
    {
      label: t("skillMapWeakness"),
      value: map.weaknesses.length
        ? `${tr(map.weaknesses[0].lesson.title)} (${map.weaknesses[0].reason})`
        : t("skillMapStrong")
    },
    {
      label: t("skillMapNext"),
      value: map.nextTrack ? tr(map.nextTrack.title) : t("skillMapFinished")
    },
    { label: t("skillMapProject"), value: map.projectText },
    {
      label: t("skillMapMastery"),
      value: map.mastery ? `${map.mastery.overallPct}% • ${t("masteryState_" + map.mastery.state)}` : "0%"
    }
  ];

  const header = el("div", { class: "skill-map-header" }, [
    el("span", { class: "skill-map-title", text: t("skillMapTitle") })
  ]);

  const list = el("div", { class: "skill-map-list" });
  skillMapNodes.forEach((node, index) => {
    const step = el("div", { class: "skill-map-step" }, [
      el("span", { class: "skill-map-label", text: node.label }),
      el("span", { class: "skill-map-value", text: node.value })
    ]);
    list.appendChild(step);
    if (index < skillMapNodes.length - 1) {
      list.appendChild(el("div", { class: "skill-map-arrow", text: "↓" }));
    }
  });

  wrap.replaceChildren(el("div", { class: "skill-map-panel" }, [header, list]));
}

function computeLearningPathInsight(categoryId, trackId, track) {
  const completed = progressRepository.getCompletedLessons(categoryId, trackId);
  const notes = loadPracticeNotes();
  const nextLesson = track.lessons.find(lesson => !completed[lesson.id]) || track.lessons[track.lessons.length - 1];
  const weakLesson = track.lessons.find(lesson => !completed[lesson.id] || !(notes[lesson.id] && notes[lesson.id].trim().length > 0));

  return {
    weakLesson,
    nextLesson,
    path: [
      tr(track.title),
      weakLesson ? tr(weakLesson.title) : t("pathStrong"),
      t("pathPractice"),
      t("pathChallenge"),
      t("pathProject")
    ]
  };
}

function renderLearningPathInsight(categoryId, trackId, track) {
  const wrap = document.getElementById("learningPathWrap");
  if (!wrap) return;

  const insight = computeLearningPathInsight(categoryId, trackId, track);
  const summary = el("div", { class: "learning-path-panel" }, [
    el("div", { class: "learning-path-header", text: t("learningPathTitle") }),
    el("div", { class: "learning-path-flow" }, insight.path.map(item =>
      el("span", { class: "learning-path-node", text: item })
    ))
  ]);

  wrap.replaceChildren(summary);
}


document.getElementById("onboardingSkipBtn").onclick = () => {
  userPrefs = { goal: null, level: null, timePerDay: 20, onboarded: true };
  savePrefs(userPrefs);
  closeOnboarding();
  renderAll();
};

document.getElementById("onboardingSaveBtn").onclick = () => {
  userPrefs = { goal: onboardingSelection.goal, level: onboardingSelection.level, timePerDay: onboardingSelection.timePerDay || 20, onboarded: true };
  savePrefs(userPrefs);
  closeOnboarding();
  renderAll();
};

document.getElementById("editPrefsBtn").onclick = openOnboarding;

// ===================================================================
// التطبيق العملي (Hands-on practice) — مساحة نصية حرة لكل درس يكتب
// فيها المستخدم إجابته/ملاحظاته، محفوظة محليًا فقط (بلا خادم).
// ===================================================================
function loadPracticeNotes() {
  try {
    const raw = JSON.parse(localStorage.getItem(PRACTICE_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function savePracticeNote(lessonId, text) {
  const notes = loadPracticeNotes();
  if (text) notes[lessonId] = text;
  else delete notes[lessonId];
  try {
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(notes));
  } catch (e) {
    // فشل حفظ ملاحظة تطبيق واحدة لا يجب أن يوقف التطبيق.
  }
}

function summarizePracticeText(lesson, noteText) {
  const text = (noteText || "").trim();
  if (!text) {
    return {
      status: t("practiceMissing"),
      detail: t("practiceMissingDetail", { title: tr(lesson.title) }),
      next: t("practiceNextStep")
    };
  }
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 10) {
    return {
      status: t("practiceNeedsMore"),
      detail: t("practiceNeedsMoreDetail", { title: tr(lesson.title) }),
      next: t("practiceNextStep")
    };
  }
  return {
    status: t("practiceStrong"),
    detail: t("practiceStrongDetail", { title: tr(lesson.title) }),
    next: t("practiceNextStep")
  };
}

function buildPracticeBox(lesson) {
  const lessonId = lesson.id;
  const notes = loadPracticeNotes();
  const savedNote = el("span", { class: "practice-saved-note hidden", text: t("practiceSaved") });
  const feedbackStatus = el("span", { class: "practice-feedback-status" });
  const feedbackDetail = el("span", { class: "practice-feedback-detail" });
  const feedbackNext = el("span", { class: "practice-feedback-next" });
  const feedbackWrap = el("div", { class: "practice-feedback" }, [feedbackStatus, feedbackDetail, feedbackNext]);

  const updateFeedback = (noteText) => {
    const summary = summarizePracticeText(lesson, noteText);
    feedbackStatus.textContent = summary.status;
    feedbackDetail.textContent = summary.detail;
    feedbackNext.textContent = summary.next;
  };

  const textarea = el("textarea", {
    class: "practice-input",
    placeholder: t("practicePlaceholder"),
    oninput: debounce(e => {
      const trimmed = e.target.value.trim();
      savePracticeNote(lessonId, trimmed);
      if (trimmed.length > 0) scheduleLessonReview(lessonId, 4);
      savedNote.classList.remove("hidden");
      clearTimeout(savedNote._t);
      savedNote._t = setTimeout(() => savedNote.classList.add("hidden"), 1800);
      updateFeedback(trimmed);
      if (currentTrackRef) {
        const found = findTrack(currentTrackRef.categoryId, currentTrackRef.trackId);
        if (found && found.track) {
          renderMasteryPanel(currentTrackRef.categoryId, currentTrackRef.trackId, found.track);
          renderSkillMap(currentTrackRef.categoryId, currentTrackRef.trackId, found.track);
          renderLearningPathInsight(currentTrackRef.categoryId, currentTrackRef.trackId, found.track);
          renderChallengePanel(currentTrackRef.categoryId, currentTrackRef.trackId, found.track);
          renderProjectPanel(currentTrackRef.categoryId, currentTrackRef.trackId, found.track);
          renderSkillEvidencePanel(currentTrackRef.categoryId, currentTrackRef.trackId, found.track);
        }
      }
      renderRecommended(computeProgressSummary());
      renderReviewQueue();
    }, 400)
  });
  textarea.value = notes[lessonId] || "";
  updateFeedback(textarea.value);
  return el("div", { class: "practice-box" }, [
    el("span", { class: "practice-label", text: t("practiceLabel") }),
    textarea,
    feedbackWrap,
    savedNote
  ]);
}

// ===================================================================
// محرك الاختبارات السريعة (Practice Engine — instant-check quiz) —
// يُفعَّل فقط للدروس التي تحتوي على حقل lesson.quiz فـ data.js (اختيار
// متعدد بتغذية راجعة فورية). هذا إضافي بحت: مُخزَّن فـ مفتاح منفصل
// (QUIZ_KEY) ولا يمس progressRepository أو أي مخطط بيانات موجود، فلا
// حاجة لأي migration ولا خطر على بيانات المستخدمين الحاليين. النتيجة
// الحقيقية (صح/خطأ) تُستعمل لاحقًا كدليل حقيقي فـ لوحة "أدلة المهارة"
// (buildTrackEvidence) بدل الرقم الوهمي challengeCount: 0 السابق.
// ===================================================================
function loadQuizState() {
  try {
    const raw = JSON.parse(localStorage.getItem(QUIZ_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function saveQuizAnswer(lessonId, optionId, correct) {
  const state = loadQuizState();
  state[lessonId] = { optionId, correct, updatedAt: Date.now() };
  try {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(state));
  } catch (e) {
    // فشل حفظ إجابة اختبار واحدة لا يجب أن يوقف التطبيق.
  }
  return state[lessonId];
}

// عدد الاختبارات المُجابة بشكل صحيح، إجمالًا أو داخل مجموعة معرّفات
// دروس محددة (لحساب دليل تحدٍ حقيقي لكل مسار على حدة).
function countCorrectQuizzes(lessonIds = null) {
  const state = loadQuizState();
  const ids = lessonIds ? new Set(lessonIds) : null;
  return Object.keys(state).filter(lessonId => {
    if (!state[lessonId] || !state[lessonId].correct) return false;
    return !ids || ids.has(lessonId);
  }).length;
}

function buildQuizBox(lesson) {
  if (!lesson.quiz || !Array.isArray(lesson.quiz.options) || !lesson.quiz.options.length) return null;

  const state = loadQuizState();
  const saved = state[lesson.id] || null;

  const feedback = el("div", { class: "quiz-feedback hidden" });
  const optionsWrap = el("div", { class: "quiz-options" });

  const renderOptions = (answeredId, wasCorrect) => {
    optionsWrap.replaceChildren();
    lesson.quiz.options.forEach(option => {
      const isCorrectOption = option.id === lesson.quiz.correctId;
      const isChosen = option.id === answeredId;
      const classes = ["quiz-option"];
      if (answeredId) {
        if (isCorrectOption) classes.push("quiz-option-correct");
        else if (isChosen) classes.push("quiz-option-incorrect");
      }
      optionsWrap.appendChild(el("button", {
        type: "button",
        class: classes.join(" "),
        disabled: !!answeredId,
        onclick: () => {
          if (answeredId) return; // إجابة واحدة مُسجَّلة لكل درس، للحفاظ على معنى "أدلة" حقيقية
          const correct = option.id === lesson.quiz.correctId;
          saveQuizAnswer(lesson.id, option.id, correct);
          renderOptions(option.id, correct);
          feedback.classList.remove("hidden");
          feedback.classList.toggle("quiz-feedback-correct", correct);
          feedback.classList.toggle("quiz-feedback-incorrect", !correct);
          feedback.replaceChildren(
            el("strong", { class: "quiz-feedback-verdict", text: correct ? t("quizCorrect") : t("quizIncorrect") }),
            el("p", { class: "quiz-feedback-explain", text: tr(lesson.quiz.explanation) })
          );
          if (currentTrackRef) {
            renderSkillEvidencePanel(currentTrackRef.categoryId, currentTrackRef.trackId, findTrack(currentTrackRef.categoryId, currentTrackRef.trackId)?.track);
          }
          renderDashboard(computeProgressSummary());
        }
      }, [tr(option.text)]));
    });
  };

  renderOptions(saved ? saved.optionId : null, saved ? saved.correct : null);
  if (saved) {
    feedback.classList.remove("hidden");
    feedback.classList.toggle("quiz-feedback-correct", saved.correct);
    feedback.classList.toggle("quiz-feedback-incorrect", !saved.correct);
    feedback.replaceChildren(
      el("strong", { class: "quiz-feedback-verdict", text: saved.correct ? t("quizCorrect") : t("quizIncorrect") }),
      el("p", { class: "quiz-feedback-explain", text: tr(lesson.quiz.explanation) })
    );
  }

  return el("div", { class: "quiz-box" }, [
    el("span", { class: "quiz-label", text: t("quizLabel") }),
    el("p", { class: "quiz-question", text: tr(lesson.quiz.question) }),
    optionsWrap,
    feedback
  ]);
}

// ===================================================================
// أصوات "المفيد" المجتمعية (Community helpful votes) — تُرسَل إلى
// Supabase إن كانت المزامنة مفعّلة (انظر auth-sync.js: submitHelpfulVote)،
// وإلا تُخزَّن محليًا فقط كتقدير تقريبي بدون مقارنة بين المستخدمين.
// ===================================================================
function loadLocalHelpfulVotes() {
  try {
    const raw = JSON.parse(localStorage.getItem(HELPFUL_LOCAL_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function buildHelpfulBox(lessonId) {
  const alreadyVoted = !!loadLocalHelpfulVotes()[lessonId];
  const question = el("span", { class: "helpful-question", text: t("helpfulQuestion") });
  const btn = el("button", {
    type: "button",
    class: "helpful-btn" + (alreadyVoted ? " voted" : ""),
    text: alreadyVoted ? t("helpfulThanks") : t("markHelpful"),
    onclick: async () => {
      const votes = loadLocalHelpfulVotes();
      if (votes[lessonId]) return;
      votes[lessonId] = true;
      try { localStorage.setItem(HELPFUL_LOCAL_KEY, JSON.stringify(votes)); } catch (e) { /* ignore */ }
      btn.textContent = t("helpfulThanks");
      btn.classList.add("voted");
      if (typeof window.masarSubmitHelpfulVote === "function") {
        try { await window.masarSubmitHelpfulVote(lessonId); } catch (e) { /* المزامنة اختيارية */ }
      }
    }
  });
  return el("div", { class: "helpful-box" }, [question, btn]);
}

// ===================================================================
// نظام الشارات (Achievements) — مبني فوق progressRepository والستريك
// الموجودين مسبقًا، بلا حاجة لأي خادم. يُخزَّن فقط تاريخ أول فتح لكل
// شارة، لعرض toast مرة واحدة فقط عند تحقيقها.
// ===================================================================
// ACHIEVEMENTS_KEY منقول إلى js/core/constants.js.
const ACHIEVEMENTS = [
  { id: "first_lesson", icon: "🌱", check: s => s.totalDone >= 1 },
  { id: "ten_lessons", icon: "📖", check: s => s.totalDone >= 10 },
  { id: "fifty_lessons", icon: "📚", check: s => s.totalDone >= 50 },
  { id: "first_book", icon: "🏆", check: s => s.booksFinished >= 1 },
  { id: "three_books", icon: "🎓", check: s => s.booksFinished >= 3 },
  { id: "streak_3", icon: "🔥", check: (s, streak) => streak.count >= 3 },
  { id: "streak_7", icon: "⚡", check: (s, streak) => streak.count >= 7 },
  { id: "streak_30", icon: "🌟", check: (s, streak) => streak.count >= 30 },
  // يعتمد على تأشير كل بنود قائمة التحدي الحقيقية (challenge checklist)،
  // وليس على مجرد فتح لوحة التحدي.
  { id: "challenge_solver", icon: "🧩", check: () => countSolvedChallenges() >= 1 },
  // يعتمد على نتيجة اختبار نهائي حقيقي مُصحَّح فعليًا (90%+)، وليس على
  // مجرد فتح لوحة الاختبار.
  { id: "assessment_ace", icon: "🎯", check: () => countHighScoreAssessments(90) >= 1 }
];

function loadUnlockedAchievements() {
  try {
    const raw = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function persistUnlockedAchievements(unlocked) {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
  } catch (e) {
    // فشل حفظ الشارات لا يجب أن يوقف التطبيق.
  }
}

// أثر بصري خفيف عند فتح شارة جديدة (§29 micro-interaction): مجموعة
// معرّفات الشارات "المفتوحة حديثًا فـ هذه الجلسة" فقط، تُستهلك مرة
// واحدة (renderAchievements تحذفها بعد رسمها بالكلاس المناسب)، فلا
// تتكرر النبضة فـ كل إعادة رسم لاحقة لنفس الشارة.
const recentlyUnlockedAchievements = new Set();

// يتحقق من الشارات الجديدة مقارنة بالحالة الحالية، يخزنها، ويعرض toast
// لكل شارة تُفتح للمرة الأولى (بدون إزعاج المستخدم بشارات محقّقة سابقًا).
function checkNewAchievements(summary, streak) {
  const unlocked = loadUnlockedAchievements();
  let changed = false;
  ACHIEVEMENTS.forEach(a => {
    if (!unlocked[a.id] && a.check(summary, streak)) {
      unlocked[a.id] = Date.now();
      changed = true;
      recentlyUnlockedAchievements.add(a.id);
      showToast(`${a.icon} ${t("achievementUnlocked", { name: t("achv_" + a.id + "_title") })}`);
    }
  });
  if (changed) persistUnlockedAchievements(unlocked);
  return unlocked;
}

// ===================================================================
// أحداث "skill_mastered" و"path_completed" — تُطلق مرة واحدة فقط لكل
// مهارة/مسار (بخلاف lesson_completed المُطلق فـ كل نقرة)، عبر تخزين
// محلي صغير إضافي (MASTERED_SKILLS_NOTIFIED_KEY/PATHS_COMPLETED_NOTIFIED_KEY)
// يحفظ فقط "هل سبق أن أُعلِم عن هذا الإنجاز"، بلا أي علاقة بمخطط التقدم
// نفسه — فلا خطر migration ولا تكرار toast/نبضة فـ كل إعادة رسم.
// ===================================================================
function loadNotifiedSet(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}
function saveNotifiedSet(key, state) {
  try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) { /* اختياري بحت */ }
}

function checkSkillMasteryAndPathEvents(categoryId, trackId, summary) {
  // ---- skill_mastered ----
  const found = findTrack(categoryId, trackId);
  if (found && found.track) {
    const mastery = computeTrackMastery(categoryId, trackId, found.track);
    if (mastery && mastery.state === "mastered") {
      const key = `${categoryId}::${trackId}`;
      const notified = loadNotifiedSet(MASTERED_SKILLS_NOTIFIED_KEY);
      if (!notified[key]) {
        notified[key] = true;
        saveNotifiedSet(MASTERED_SKILLS_NOTIFIED_KEY, notified);
        trackEvent("skill_mastered", { categoryId, trackId });
        showToast(`🏆 ${t("skillMasteredToast", { title: tr(found.track.title) })}`);
        const badge = document.querySelector(`[data-track-key="${key}"] .book-done-badge`);
        if (badge) {
          badge.classList.add("just-completed");
          setTimeout(() => badge.classList.remove("just-completed"), 2000);
        }
      }
    }
  }

  // ---- path_completed ----
  if (typeof LEARNING_PATHS === "undefined") return;
  const notifiedPaths = loadNotifiedSet(PATHS_COMPLETED_NOTIFIED_KEY);
  let changed = false;
  LEARNING_PATHS.forEach(path => {
    const progress = computeLearningPathProgress(path);
    if (progress.finished && !notifiedPaths[path.id]) {
      notifiedPaths[path.id] = true;
      changed = true;
      trackEvent("path_completed", { pathId: path.id });
      showToast(`🧭 ${t("pathCompletedToast", { title: tr(path.title) })}`);
    }
  });
  if (changed) saveNotifiedSet(PATHS_COMPLETED_NOTIFIED_KEY, notifiedPaths);
}

// ===================================================================
// نظام النقاط والمستويات (XP & Levels) — قيمة مُشتقة (derived) بحتة، لا
// تُخزَّن أبدًا فـ localStorage بمفردها، بل تُحسب دائمًا مباشرة من بيانات
// حقيقية موجودة أصلاً (الدروس المُنجزة، الاختبارات الصحيحة، التحديات
// المُنجزة). هذا يعني عدم وجود أي خطر migration: لو حُذفت هذه الدالة
// غدًا، لن تُفقد أي بيانات مستخدم لأنها لم تُخزَّن أصلًا بشكل منفصل.
// ===================================================================
function computeXP(summary) {
  const lessonsXP = summary.totalDone * 10;
  const quizXP = countCorrectQuizzes() * 5;
  const challengesXP = countSolvedChallenges() * 25;
  const booksXP = summary.booksFinished * 50;
  const assessmentXP = countPassedAssessments() * 40;
  return lessonsXP + quizXP + challengesXP + booksXP + assessmentXP;
}

// computeLevel وxpForLevel (منحنى المستوى التصاعدي) منقولتان الآن إلى
// js/core/masar-logic.js، بنفس الصيغة الرياضية تمامًا.

function renderLevelBadge(summary) {
  const badge = document.getElementById("levelBadge");
  if (!badge) return;
  const xp = computeXP(summary);
  const level = computeLevel(xp);
  const nextLevelXP = xpForLevel(level + 1);
  const currentLevelXP = xpForLevel(level);
  const pct = nextLevelXP > currentLevelXP
    ? Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
    : 100;

  badge.replaceChildren(
    el("span", { class: "level-num", text: t("levelBadgeLabel", { level }) }),
    el("span", { class: "level-xp", text: t("xpLabel", { xp }) })
  );
  badge.title = t("levelProgressHint", { current: xp, next: nextLevelXP });
  badge.style.setProperty("--level-progress", Math.min(100, Math.max(0, pct)) + "%");
}

function renderAchievements(summary, streak) {
  const container = document.getElementById("achievementsGrid");
  if (!container) return;
  const unlocked = checkNewAchievements(summary, streak);
  container.replaceChildren();
  ACHIEVEMENTS.forEach(a => {
    const isUnlocked = !!unlocked[a.id];
    const justUnlocked = recentlyUnlockedAchievements.has(a.id);
    const badge = el("div", { class: "achv-badge" + (isUnlocked ? " unlocked" : "") + (justUnlocked ? " just-unlocked" : "") }, [
      el("span", { class: "achv-icon", "aria-hidden": "true", text: a.icon }),
      el("span", { class: "achv-name", text: t("achv_" + a.id + "_title") })
    ]);
    badge.title = isUnlocked ? t("achv_" + a.id + "_desc") : t("achievementLocked");
    container.appendChild(badge);
    // الأثر يُستهلك مرة واحدة: نحذفه من الطابور فور رسمه بالكلاس، ونُزيل
    // الكلاس من الـ DOM بعد انتهاء الأنيميشن حتى لا يبقى معلّقًا لو
    // أُعيد استعمال نفس العنصر لاحقًا بأي طريقة أخرى.
    if (justUnlocked) {
      recentlyUnlockedAchievements.delete(a.id);
      setTimeout(() => badge.classList.remove("just-unlocked"), 2000);
    }
  });
}

function buildPortfolioSummary(summary) {
  const masteredTracks = SKILL_DATA.reduce((count, category) => {
    return count + category.tracks.filter(track => {
      const info = summary.perTrack.get(`${category.id}::${track.id}`);
      return !!info && info.total > 0 && info.done === info.total;
    }).length;
  }, 0);

  const totalLessons = SKILL_DATA.reduce((sum, category) => {
    return sum + category.tracks.reduce((trackSum, track) => trackSum + track.lessons.length, 0);
  }, 0);

  const practiceCount = Object.keys(loadPracticeNotes()).length;
  const goalLabel = userPrefs.goal ? tr(SKILL_DATA.find(cat => cat.id === userPrefs.goal)?.name || { en: "Learning" }) : t("profileGeneral");
  const levelLabel = userPrefs.level ? TRACK_LEVEL_LABELS[userPrefs.level][currentLang] || TRACK_LEVEL_LABELS[userPrefs.level].en : t("profileGeneral");

  return {
    masteredTracks,
    totalLessons,
    practiceCount,
    completionPct: totalLessons === 0 ? 0 : Math.round((summary.totalDone / totalLessons) * 100),
    goalLabel,
    levelLabel
  };
}

function renderPortfolioSummary(summary) {
  const section = document.getElementById("portfolioSection");
  const grid = document.getElementById("portfolioGrid");
  if (!section || !grid) return;

  const data = buildPortfolioSummary(summary);
  const items = [
    { label: t("portfolioEvidence"), value: `${data.masteredTracks} ${t("portfolioTracks")}` },
    { label: t("portfolioProgress"), value: `${data.completionPct}%` },
    { label: t("portfolioPractice"), value: `${data.practiceCount}` },
    { label: t("portfolioGoal"), value: data.goalLabel },
    { label: t("portfolioLevel"), value: data.levelLabel },
    { label: t("portfolioPrivacy"), value: t("portfolioPrivate") }
  ];

  grid.replaceChildren();
  items.forEach(item => {
    grid.appendChild(el("div", { class: "portfolio-item" }, [
      el("span", { class: "portfolio-label", text: item.label }),
      el("strong", { class: "portfolio-value", text: item.value })
    ]));
  });

  // أدلة حقيقية لكل مهارة على حدة (Evidence > Claims): كل رقم هنا
  // مأخوذ مباشرة من computeTrackMastery، بلا أي تقريب أو ادعاء إضافي.
  const skillsListId = "portfolioSkillsList";
  let skillsList = document.getElementById(skillsListId);
  if (!skillsList) {
    skillsList = el("div", { id: skillsListId, class: "portfolio-skills-list" });
    section.appendChild(skillsList);
  }
  skillsList.replaceChildren();
  const startedTracks = [];
  SKILL_DATA.forEach(category => {
    category.tracks.forEach(track => {
      const info = summary.perTrack.get(`${category.id}::${track.id}`);
      if (info && info.done > 0) {
        const mastery = computeTrackMastery(category.id, track.id, track);
        startedTracks.push({ category, track, mastery, done: info.done, total: info.total });
      }
    });
  });
  if (startedTracks.length) {
    startedTracks.sort((a, b) => (b.mastery ? b.mastery.overallPct : 0) - (a.mastery ? a.mastery.overallPct : 0));
    skillsList.appendChild(el("div", { class: "portfolio-skills-title", text: t("portfolioSkillsTitle") }));
    startedTracks.forEach(({ track, mastery }) => {
      const pct = mastery ? mastery.overallPct : 0;
      const fill = el("div", { class: "portfolio-skill-fill" });
      fill.style.width = pct + "%";
      skillsList.appendChild(el("div", { class: "portfolio-skill-row" }, [
        el("span", { class: "portfolio-skill-name", text: tr(track.title) }),
        el("div", { class: "portfolio-skill-bar" }, [fill]),
        el("span", { class: "portfolio-skill-pct", text: pct + "%" })
      ]));
    });
  }

  section.classList.remove("hidden");
}

function buildLearningJournal(summary) {
  const notes = loadPracticeNotes();
  const dueCount = getDueReviews(10).length;
  const noteEntries = Object.entries(notes)
    .slice(0, 3)
    .map(([lessonId, text]) => {
      const lesson = (() => {
        for (const category of SKILL_DATA) {
          for (const track of category.tracks) {
            const match = track.lessons.find(item => item.id === lessonId);
            if (match) return match;
          }
        }
        return null;
      })();
      return {
        title: lesson ? tr(lesson.title) : lessonId,
        snippet: (text || "").trim().slice(0, 80) || t("journalEmptyNote")
      };
    });

  const cont = findContinueTrack(summary);
  return {
    dueCount,
    noteCount: Object.keys(notes).length,
    streakCount: currentStreak.count,
    focusTitle: cont.track ? tr(cont.track.title) : t("journalFocus"),
    noteEntries
  };
}

function renderLearningJournal(summary) {
  const section = document.getElementById("journalSection");
  const grid = document.getElementById("journalGrid");
  if (!section || !grid) return;

  const data = buildLearningJournal(summary);
  const cards = [
    { label: t("journalNotes"), value: String(data.noteCount) },
    { label: t("journalDue"), value: String(data.dueCount) },
    { label: t("journalStreak"), value: `${data.streakCount} ${t("streakLabel")}` }
  ];

  const cardList = el("div", { class: "journal-metrics" }, cards.map(item =>
    el("div", { class: "journal-metric" }, [
      el("span", { class: "journal-label", text: item.label }),
      el("strong", { class: "journal-value", text: item.value })
    ])
  ));

  const highlight = el("div", { class: "journal-focus" }, [
    el("span", { class: "journal-focus-label", text: t("journalFocus") }),
    el("strong", { class: "journal-focus-title", text: data.focusTitle })
  ]);

  const notes = el("div", { class: "journal-notes" },
    data.noteEntries.length
      ? data.noteEntries.map(entry => el("div", { class: "journal-note" }, [
          el("strong", { class: "journal-note-title", text: entry.title }),
          el("span", { class: "journal-note-body", text: entry.snippet })
        ]))
      : [el("div", { class: "journal-note empty", text: t("journalEmpty") })]
  );

  grid.replaceChildren(cardList, highlight, notes);
  section.classList.remove("hidden");
}

function buildLearningPlan() {
  const goalCat = userPrefs.goal ? SKILL_DATA.find(cat => cat.id === userPrefs.goal) : SKILL_DATA[0];
  const baseTracks = (goalCat?.tracks || SKILL_DATA[0].tracks).slice(0, 4);
  const weekNames = [
    t("planWeek1"),
    t("planWeek2"),
    t("planWeek3"),
    t("planWeek4")
  ];

  return weekNames.map((label, index) => {
    const track = baseTracks[index] || baseTracks[baseTracks.length - 1];
    return {
      week: label,
      focus: track ? tr(track.title) : t("planNextFocus"),
      detail: track ? `${t("planFocusOn")} ${tr(track.summary)}` : t("planKeepGoing")
    };
  });
}

function renderLearningPlan() {
  const section = document.getElementById("planSection");
  const grid = document.getElementById("learningPlanGrid");
  if (!section || !grid) return;

  const plan = buildLearningPlan();
  grid.replaceChildren();
  plan.forEach(item => {
    grid.appendChild(el("div", { class: "plan-item" }, [
      el("span", { class: "plan-week", text: item.week }),
      el("strong", { class: "plan-focus", text: item.focus }),
      el("span", { class: "plan-detail", text: item.detail })
    ]));
  });

  section.classList.remove("hidden");
}

// جلسة 10 دقائق حقيقية (§18): بدل عنصر عمل واحد فقط (كان "recommend"/
// "review" يفتحان نفس المسار بلا أي هيكلة زمنية حقيقية داخله)، نبني
// الآن أربع مراحل فعلية بأوزان الوقت 2/3/3/2 دقائق كما يطلب المخطط:
// Learn (شرح الدرس التالي) → Example (المثال المرفق بنفس الدرس، إن
// وجد) → Practice (مربع "جرّب بنفسك" لنفس الدرس) → Challenge (مراجعة
// مستحقة إن كانت موجودة، وإلا اختبار الدرس السريع إن وجد). كل مرحلة
// تشير لعنصر حقيقي موجود أصلاً فـ الصفحة (lesson.explain/example/tip،
// lesson.quiz)، لا خطوات وهمية. لو نقص عنصر ما (مثلاً درس بلا quiz)
// تُحذف مرحلته بصمت بدل عرض خطوة فارغة.
function buildTenMinuteSession(summary) {
  const cont = findContinueTrack(summary);
  const nextLesson = cont.track.lessons.find(lesson => {
    const completed = progressRepository.getCompletedLessons(cont.category.id, cont.track.id);
    return !completed[lesson.id];
  }) || cont.track.lessons[0];

  const dueReviews = getDueReviews(1);

  const stages = [];
  if (nextLesson && nextLesson.explain) {
    stages.push({ minutes: 2, labelKey: "tenMinuteStageLearn", title: tr(nextLesson.title) });
  }
  if (nextLesson && nextLesson.example) {
    stages.push({ minutes: 3, labelKey: "tenMinuteStageExample", title: tr(nextLesson.title) });
  }
  if (nextLesson) {
    stages.push({ minutes: 3, labelKey: "tenMinuteStagePractice", title: tr(nextLesson.title) });
  }
  if (dueReviews.length) {
    stages.push({ minutes: 2, labelKey: "tenMinuteStageChallenge", title: tr(dueReviews[0].lesson.title) });
  } else if (nextLesson && nextLesson.quiz) {
    stages.push({ minutes: 2, labelKey: "tenMinuteStageChallenge", title: tr(nextLesson.title) });
  }

  return { track: cont.track, category: cont.category, lesson: nextLesson, stages };
}

function renderQuickPlan(summary) {
  const section = document.getElementById("quickPlanSection");
  const card = document.getElementById("quickPlanCard");
  if (!section || !card) return;

  const session = buildTenMinuteSession(summary);
  card.replaceChildren();

  card.appendChild(el("div", { class: "quick-plan-head" }, [
    el("span", { class: "quick-plan-badge", text: t("tenMinuteTitle") }),
    el("strong", { class: "quick-plan-title", text: session.lesson ? tr(session.lesson.title) : t("tenMinuteFallback") })
  ]));

  if (session.stages.length) {
    const totalMinutes = session.stages.reduce((sum, s) => sum + s.minutes, 0);
    card.appendChild(el("p", { class: "quick-plan-desc", text: t("tenMinuteStagesIntro", { minutes: totalMinutes }) }));
    card.appendChild(el("div", { class: "quick-plan-stages" }, session.stages.map(stage =>
      el("div", { class: "quick-plan-stage" }, [
        el("span", { class: "quick-plan-stage-minutes", text: t("minutesShort", { minutes: stage.minutes }) }),
        el("span", { class: "quick-plan-stage-label", text: t(stage.labelKey) })
      ])
    )));
  } else {
    card.appendChild(el("p", { class: "quick-plan-desc", text: t("tenMinuteFallbackDetail") }));
  }

  card.appendChild(el("button", {
    type: "button",
    class: "btn-primary",
    text: t("tenMinuteStart"),
    onclick: () => openTrack(session.category.id, session.track.id)
  }));

  section.classList.remove("hidden");
}

// ===================================================================
// شهادة إتمام قابلة للتحميل — تُرسم على canvas وتُصدَّر كصورة PNG،
// بلا أي مكتبة خارجية أو اتصال بخادم.
// ===================================================================
function downloadCertificate(trackTitle, assessmentLine = null, evidenceLine = null) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#FAF6EC";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#D98E2B";
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
  ctx.strokeStyle = "#3D2E22";
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  ctx.direction = isRtlLanguage(currentLang) ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.fillStyle = "#3D2E22";
  ctx.font = "bold 30px Cairo, sans-serif";
  ctx.fillText(t("appName"), canvas.width / 2, 150);

  ctx.font = "24px Cairo, sans-serif";
  ctx.fillStyle = "#5A4E40";
  ctx.fillText(t("certificateHeading"), canvas.width / 2, 235);

  ctx.font = "bold 42px Cairo, sans-serif";
  ctx.fillStyle = "#2F6F5E";
  ctx.fillText(trackTitle, canvas.width / 2, 340);

  ctx.font = "20px Cairo, sans-serif";
  ctx.fillStyle = "#5A4E40";
  ctx.fillText(t("certificateDate", { date: new Date().toLocaleDateString(currentLang) }), canvas.width / 2, 400);

  // §13: سطر الأدلة الحقيقية (دروس/تطبيق/تحديات/مشاريع/إتقان) — يُرسم
  // دائمًا إن توفر، بغض النظر عن وجود اختبار نهائي لهذا المسار أم لا.
  // هذا هو الفرق الجوهري عن السلوك القديم الذي كان يكتفي بنتيجة
  // الاختبار وحدها (أو لا شيء إطلاقًا لمسارات بلا اختبار).
  let cursorY = 460;
  if (evidenceLine) {
    ctx.font = "19px Cairo, sans-serif";
    ctx.fillStyle = "#3D2E22";
    ctx.fillText(evidenceLine, canvas.width / 2, cursorY);
    cursorY += 40;
  }

  if (assessmentLine) {
    ctx.font = "20px Cairo, sans-serif";
    ctx.fillStyle = "#2F6F5E";
    ctx.fillText(assessmentLine, canvas.width / 2, cursorY);
  }

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const link = el("a", { href: url, download: `masar-certificate-${getLocalDateKey()}.png` });
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

// ===================================================================
// حالة التطبيق
// ===================================================================
let currentStreak = loadStreak();
let activeCategory = "all";
let searchQuery = "";
let currentTrackRef = null; // { categoryId, trackId }
let hasPushedTrackState = false; // لمعرفة هل يمكن الاعتماد على history.back() بأمان

// ===================================================================
// حسابات التقدم — تُحسب مرة واحدة لكل عملية رسم (renderAll) بدل إعادة
// المرور على كل الدروس في كل مكان (computeStats/findContinueTrack/renderShelves).
// ===================================================================
function countDone(categoryId, trackId, lessons) {
  if (!lessons.length) return 0;
  const completed = progressRepository.getCompletedLessons(categoryId, trackId);
  return lessons.reduce((sum, lesson) => sum + (completed[lesson.id] ? 1 : 0), 0);
}

// progressPercent منقولة الآن إلى js/core/masar-logic.js (دالة نقية
// بسيطة، مُختبرة فـ tests/masar-logic.test.js).

// ===================================================================
// نموذج الإتقان (Skill mastery) — يُحسب من إشارتين حقيقيتين متوفرتين
// فعلًا في التخزين المحلي، لا شيء وهمي: "المعرفة" هي نسبة الدروس
// المُنجزة، و"التطبيق" هي نسبة الدروس التي كتب فيها المستخدم إجابة
// تطبيق عملي فعلية (وليس مجرد فتح الدرس). بُعد "الاستيعاب طويل المدى"
// (Retention) غير موجود بعد لأنه يحتاج نظام تكرار متباعد (spaced
// repetition) لم يُبنَ بعد؛ لذلك نُصرّح بذلك بدل اختلاق رقم — تجنبًا
// للدقة الزائفة.
//
// "الإتقان الكامل" (mastered) يتطلب إنجاز كل الدروس وكتابة تطبيق
// عملي في كل واحد منها، لا مجرد المرور عليها نقرًا: هذا عمدًا، حتى لا
// يصبح المستخدم "متقنًا" لمهارة لمجرد أنه ضغط "تم" على كل درس.
// ===================================================================
// تحديث (§6): "الإتقان الإجمالي" كان يعتمد فقط على المعرفة والتطبيق
// (50/50)، متجاهلًا دليلين حقيقيين متوفرين أصلاً فـ التطبيق: التحدي
// (checklist حقيقي، isChallengeSolved) والمشروع (تسليم حقيقي،
// masarGetProjectSubmission). الآن الأربعة موزونة معًا (35/25/20/20)،
// فالرقم النهائي يعكس فعلًا "هل تقدر تستعمل هاد المهارة" لا فقط "هل
// قريتي الدروس". كل مكون لا يزال محسوبًا من بيانات حقيقية 100%، بلا أي
// رقم مختلق: doneCount/practicedCount من نفس المصدر السابق، والتحدي
// والمشروع من دوال موجودة أصلاً (لم يكن ينقصها سوى الدمج فـ المعادلة).
function computeTrackMastery(categoryId, trackId, track) {
  const total = track.lessons.length;
  if (total === 0) return null;

  const completed = progressRepository.getCompletedLessons(categoryId, trackId);
  const notes = loadPracticeNotes();

  let doneCount = 0, practicedCount = 0;
  track.lessons.forEach(lesson => {
    if (completed[lesson.id]) doneCount++;
    if (notes[lesson.id] && notes[lesson.id].trim().length > 0) practicedCount++;
  });

  const knowledgePct = progressPercent(doneCount, total);
  const practicePct = progressPercent(practicedCount, total);
  const challengePct = (typeof isChallengeSolved === "function" && isChallengeSolved(trackId)) ? 100 : 0;
  const submission = (typeof window !== "undefined" && typeof window.masarGetProjectSubmission === "function")
    ? window.masarGetProjectSubmission(trackId)
    : null;
  const projectPct = (submission && submission.submittedAt) ? 100 : 0;

  const overallPct = Math.round(
    knowledgePct * 0.35 + practicePct * 0.25 + challengePct * 0.2 + projectPct * 0.2
  );

  // §6: الاستيعاب طويل المدى (retention) محسوب الآن فعليًا من بيانات
  // التكرار المتباعد الحقيقية (RETENTION_KEY عبر scheduleLessonReview)،
  // بدل عرضه دائمًا كـ"لا بيانات كافية". يبقى null بصدق إن لم تتوفر
  // مراجعات كافية بعد — لا نختلق رقمًا. هذا مؤشر إعلامي إضافي، ولا
  // يدخل فـ معادلة overallPct الموزونة أعلاه حتى لا نزعزع الحالات
  // (notStarted/learning/.../mastered) المُعايرة مسبقًا على المكوّنات
  // الأربعة الأصلية.
  const retention = computeRetentionScore(track.lessons, completed, loadRetentionState());

  let state;
  if (doneCount === 0) state = "notStarted";
  else if (knowledgePct < 100) state = "learning";
  else if (practicePct < 40) state = "practicing";
  else if (practicePct < 80 || challengePct === 0) state = "developing";
  else if (practicePct < 100 || projectPct === 0) state = "proficient";
  else state = "mastered";

  return {
    knowledgePct, practicePct, challengePct, projectPct,
    retentionPct: retention ? retention.pct : null,
    retentionReviewedCount: retention ? retention.reviewedCount : 0,
    overallPct, state, total, doneCount, practicedCount
  };
}

function computeProgressSummary() {
  let totalDone = 0, booksInProgress = 0, booksFinished = 0;
  const perTrack = new Map();

  SKILL_DATA.forEach(cat => {
    cat.tracks.forEach(track => {
      const done = countDone(cat.id, track.id, track.lessons);
      const total = track.lessons.length;
      perTrack.set(`${cat.id}::${track.id}`, { done, total, pct: progressPercent(done, total) });
      totalDone += done;
      if (done > 0 && done < total) booksInProgress++;
      if (total > 0 && done === total) booksFinished++;
    });
  });

  return { totalDone, booksInProgress, booksFinished, perTrack };
}

function findContinueTrack(summary) {
  for (const cat of SKILL_DATA) {
    for (const track of cat.tracks) {
      const info = summary.perTrack.get(`${cat.id}::${track.id}`);
      if (info.done > 0 && info.done < info.total) {
        return { category: cat, track, done: info.done };
      }
    }
  }
  const cat = SKILL_DATA[0];
  return { category: cat, track: cat.tracks[0], done: 0 };
}

// ===================================================================
// المسارات المهنية (Learning Paths) — تُبنى فوق LEARNING_PATHS (data.js)
// وprogressRepository الحقيقي فقط. لا تخزّن أي حالة خاصة بها: تقدمها
// محسوب دائمًا من نفس بيانات التقدم لكل track، فلا يوجد رقم مختلق ولا
// حاجة لأي migration.
// ===================================================================
function computeLearningPathProgress(path) {
  let totalLessons = 0, doneLessons = 0;
  let nextStep = null;
  path.steps.forEach(step => {
    const found = findTrack(step.categoryId, step.trackId);
    if (!found || !found.track) return;
    const done = countDone(step.categoryId, step.trackId, found.track.lessons);
    const total = found.track.lessons.length;
    totalLessons += total;
    doneLessons += done;
    if (!nextStep && done < total) nextStep = { ...step, track: found.track, category: found.category, done, total };
  });
  return {
    pct: progressPercent(doneLessons, totalLessons),
    doneLessons,
    totalLessons,
    finished: totalLessons > 0 && doneLessons === totalLessons,
    nextStep
  };
}

function renderLearningPaths(summary) {
  const section = document.getElementById("pathsSection");
  const grid = document.getElementById("pathsGrid");
  if (!section || !grid || typeof LEARNING_PATHS === "undefined") return;

  grid.replaceChildren();
  LEARNING_PATHS.forEach(path => {
    const progress = computeLearningPathProgress(path);
    const fill = el("div", { class: "path-progress-fill" });
    fill.style.width = progress.pct + "%";

    const card = el("button", {
      type: "button",
      class: "path-card" + (progress.finished ? " path-finished" : ""),
      onclick: () => {
        if (progress.nextStep) openTrack(progress.nextStep.categoryId, progress.nextStep.trackId);
        else if (path.steps[0]) openTrack(path.steps[0].categoryId, path.steps[0].trackId);
      }
    }, [
      el("div", { class: "path-card-head" }, [
        el("span", { class: "path-icon", "aria-hidden": "true", text: path.icon || "🧭" }),
        el("strong", { class: "path-title", text: tr(path.title) })
      ]),
      el("p", { class: "path-desc", text: tr(path.description) }),
      // تلميح بصري ✓/🔒 لكل خطوة (§7): "مقفلة" هنا معلوماتية بحتة (soft
      // lock)، بنفس فلسفة getIncompletePrerequisites أعلاه — تخبر
      // المستخدم أن الخطوات السابقة لم تكتمل بعد، لكنها لا تمنعه فعليًا
      // من فتح أي خطوة يريدها (كل مسار مستقل بذاته وقابل للفتح مباشرة).
      el("div", { class: "path-steps" }, (() => {
        let previousDone = true; // الخطوة الأولى دائمًا "مفتوحة"
        return path.steps.map((step, idx) => {
          const found = findTrack(step.categoryId, step.trackId);
          const stepDone = found ? countDone(step.categoryId, step.trackId, found.track.lessons) === found.track.lessons.length && found.track.lessons.length > 0 : false;
          const stepLocked = !stepDone && !previousDone;
          const dotClass = "path-step-dot" + (stepDone ? " done" : (stepLocked ? " locked" : ""));
          const dot = el("span", {
            class: dotClass,
            title: stepDone ? t("pathStepDone") : (stepLocked ? t("pathStepLocked") : t("pathStepReady"))
          }, [
            stepDone
              ? el("span", { class: "path-step-icon", "aria-hidden": "true", text: "✓" })
              : (stepLocked
                ? el("span", { class: "path-step-icon", "aria-hidden": "true", text: "🔒" })
                : el("span", { class: "path-step-num", text: String(idx + 1) }))
          ]);
          previousDone = stepDone;
          return dot;
        });
      })()),
      el("div", { class: "path-progress-track" }, [fill]),
      el("span", { class: "path-progress-label", text: progress.finished ? t("pathFinished") : t("pathProgressLabel", { pct: progress.pct }) })
    ]);
    grid.appendChild(card);
  });

  section.classList.toggle("hidden", LEARNING_PATHS.length === 0);
}

// ===================================================================
// تقدير الوقت (estimatedMinutes) — يُستخرج مباشرة من نص duration
// الموجود أصلاً فـ data.js (مثال: "~45 minutes") بدل إضافة حقل جديد
// لكل مسار، تفاديًا لأي خطر على البيانات الحالية. إن تعذّر الاستخراج
// نرجع تقديرًا معقولًا (15 دقيقة) بدل قيمة وهمية دقيقة.
// ===================================================================
function estimateTrackMinutes(track) {
  const text = tr(track.duration) || "";
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 15;
}

function estimateLessonMinutes(track) {
  const total = estimateTrackMinutes(track);
  const count = track.lessons.length || 1;
  return Math.max(3, Math.round(total / count));
}

// ===================================================================
// قائمة اليوم (Daily Learning Queue) — تبني قائمة حقيقية (وليست عنصرًا
// واحدًا فقط كما فـ renderQuickPlan) مبنية على وقت المستخدم المتاح
// (userPrefs.timePerDay) والبيانات الحقيقية: مراجعات مستحقة أولًا (لأن
// النسيان يتراكم)، ثم إكمال المسار الحالي، ثم أول توصية غير مكررة.
// تتوقف القائمة بمجرد أن يمتلئ وقت اليوم المتاح، فلا تُغرق مستخدمًا
// عنده 10 دقائق فقط بعناصر لن ينجزها.
// ===================================================================
function computeDailyQueue(summary) {
  const budgetMinutes = userPrefs.timePerDay || 20;
  const queue = [];
  let usedMinutes = 0;
  const seenTrackKeys = new Set();

  getDueReviews(5).forEach(item => {
    if (usedMinutes >= budgetMinutes) return;
    queue.push({
      type: "review",
      minutes: 3,
      title: tr(item.lesson.title),
      subtitle: `${tr(item.category.name)} · ${tr(item.track.title)}`,
      action: () => openTrack(item.category.id, item.track.id)
    });
    usedMinutes += 3;
  });

  const cont = findContinueTrack(summary);
  if (cont.done > 0 && usedMinutes < budgetMinutes) {
    const key = `${cont.category.id}::${cont.track.id}`;
    if (!seenTrackKeys.has(key)) {
      const minutes = estimateLessonMinutes(cont.track);
      queue.push({
        type: "continue",
        minutes,
        title: t("dailyQueueContinue", { title: tr(cont.track.title) }),
        subtitle: t("pageCount", { done: cont.done, total: cont.track.lessons.length }),
        action: () => openTrack(cont.category.id, cont.track.id)
      });
      usedMinutes += minutes;
      seenTrackKeys.add(key);
    }
  }

  if (usedMinutes < budgetMinutes) {
    const picks = computeRecommendedTracks(summary, 5);
    for (const pick of picks) {
      const key = `${pick.category.id}::${pick.track.id}`;
      if (seenTrackKeys.has(key)) continue;
      if (usedMinutes >= budgetMinutes) break;
      const minutes = estimateLessonMinutes(pick.track);
      queue.push({
        type: "recommended",
        minutes,
        title: tr(pick.track.title),
        subtitle: pick.reason,
        action: () => openTrack(pick.category.id, pick.track.id)
      });
      usedMinutes += minutes;
      seenTrackKeys.add(key);
      break; // عنصر واحد جديد يكفي بعد المراجعة والمتابعة، حتى لا تطول القائمة بلا داع
    }
  }

  return { queue, budgetMinutes, usedMinutes };
}

function renderDailyQueue(summary) {
  const section = document.getElementById("dailyQueueSection");
  const list = document.getElementById("dailyQueueList");
  if (!section || !list) return;

  const { queue, budgetMinutes } = computeDailyQueue(summary);
  list.replaceChildren();

  if (!queue.length) {
    section.classList.add("hidden");
    return;
  }

  queue.forEach(item => {
    const li = el("li", { class: "daily-queue-item" }, [
      el("button", {
        type: "button",
        class: "daily-queue-btn",
        onclick: item.action
      }, [
        el("span", { class: "daily-queue-minutes", text: t("minutesShort", { minutes: item.minutes }) }),
        el("span", { class: "daily-queue-text" }, [
          el("strong", { class: "daily-queue-title", text: item.title }),
          el("span", { class: "daily-queue-subtitle", text: item.subtitle })
        ])
      ])
    ]);
    list.appendChild(li);
  });

  section.classList.remove("hidden");
  const titleEl = document.getElementById("dailyQueueTitle");
  if (titleEl) titleEl.textContent = t("dailyQueueTitleWithBudget", { minutes: budgetMinutes });
}

// ===================================================================
// مرشد مسار (Masar Mentor) — تنبيه مهم بخصوص الصدق: هذا ليس نموذج ذكاء
// اصطناعي، ولا يدّعي ذلك. إنه محرك إرشاد قائم على قواعد صريحة، مبني
// بالكامل على بيانات حقيقية موجودة أصلاً فـ التطبيق (نقاط الضعف،
// الإتقان، المراجعات المستحقة، الهدف). يتبع بنية Hint → Explanation →
// Guided step بدل إعطاء الجواب مباشرة، كما تطلب مواصفة "عدم الكشف عن
// الحل فورًا". إن لم تتوفر بيانات كافية يصرّح بذلك بدل اختلاق نصيحة.
// ===================================================================
function buildMentorGuidance(summary) {
  const dueReviews = getDueReviews(1);
  if (dueReviews.length) {
    const item = dueReviews[0];
    return {
      hint: t("mentorHintReview"),
      explanation: t("mentorExplainReview", { title: tr(item.lesson.title) }),
      guidedStep: t("mentorGuidedReview", { title: tr(item.lesson.title) }),
      action: t("mentorActionReview"),
      onAction: () => openTrack(item.category.id, item.track.id)
    };
  }

  const cont = findContinueTrack(summary);
  if (cont.done > 0) {
    const weakness = collectTrackWeakness(cont.category.id, cont.track.id, cont.track);
    if (weakness) {
      return {
        hint: t("mentorHintWeakness"),
        explanation: t("mentorExplainWeakness", { title: tr(weakness.lesson.title), reason: weakness.reason }),
        guidedStep: t("mentorGuidedWeakness", { title: tr(weakness.lesson.title) }),
        action: t("mentorActionWeakness"),
        onAction: () => openTrack(cont.category.id, cont.track.id)
      };
    }
    return {
      hint: t("mentorHintContinue"),
      explanation: t("mentorExplainContinue", { title: tr(cont.track.title), done: cont.done, total: cont.track.lessons.length }),
      guidedStep: t("mentorGuidedContinue", { title: tr(cont.track.title) }),
      action: t("mentorActionContinue"),
      onAction: () => openTrack(cont.category.id, cont.track.id)
    };
  }

  return {
    hint: t("mentorHintStart"),
    explanation: t("mentorExplainStart"),
    guidedStep: t("mentorGuidedStart"),
    action: t("mentorActionStart"),
    onAction: () => { const cat = SKILL_DATA[0]; openTrack(cat.id, cat.tracks[0].id); }
  };
}

// §15: كشف تدريجي حقيقي (stage: 0=hint فقط، 1=+explanation، 2=+guidedStep
// وزر الإجراء). الحالة محلية لهذا الاستدعاء فقط (تُعاد للصفر فـ كل
// renderDashboard جديد) — قيد معروف وبسيط، مقبول لأن الهدف هو تشجيع
// قراءة كل مرحلة بوعي فـ كل مرة، لا حفظ تفضيل دائم لواجهة إرشادية خفيفة
// كهذه.
function renderMentorPanel(summary) {
  const section = document.getElementById("mentorSection");
  const card = document.getElementById("mentorCard");
  if (!section || !card) return;

  const guidance = buildMentorGuidance(summary);
  let stage = 0; // 0: hint, 1: +explanation, 2: +guidedStep +action

  function render() {
    const children = [
      el("span", { class: "mentor-disclaimer", text: t("mentorDisclaimer") }),
      el("p", { class: "mentor-hint", text: guidance.hint })
    ];

    if (stage >= 1) {
      children.push(el("p", { class: "mentor-explanation", text: guidance.explanation }));
    } else {
      children.push(el("button", {
        type: "button",
        class: "btn-back mentor-reveal-btn",
        text: t("mentorShowExplanation"),
        onclick: () => { stage = 1; render(); }
      }));
    }

    if (stage >= 1 && stage < 2) {
      children.push(el("button", {
        type: "button",
        class: "btn-back mentor-reveal-btn",
        text: t("mentorShowGuidedStep"),
        onclick: () => { stage = 2; render(); }
      }));
    }

    if (stage >= 2) {
      children.push(el("div", { class: "mentor-guided-step" }, [
        el("span", { class: "mentor-guided-step-label", text: t("mentorGuidedStepLabel") }),
        el("p", { class: "mentor-guided-step-text", text: guidance.guidedStep })
      ]));
      children.push(el("button", { type: "button", class: "btn-primary", text: guidance.action, onclick: guidance.onAction }));
    }

    card.replaceChildren(...children);
  }

  render();
  section.classList.remove("hidden");
}

// ===================================================================
// خُطاف تحليلات خفيف (Analytics hook) — لا يرسل أي بيانات لأي خادم
// خارجي، ولا يجمع معلومات حساسة. الهدف فقط توفير نقطة تكامل واحدة
// وواضحة (provider-agnostic) لو أراد المطوّر لاحقًا ربطها بخدمة تحليلات
// حقيقية، بدل نثر console.log فوضوي فكل مكان. يحتفظ بسجل محلي محدود
// الحجم (آخر 200 حدث) قابل للفحص من devtools فقط.
// ===================================================================
// ANALYTICS_KEY وANALYTICS_MAX_EVENTS منقولان إلى js/core/constants.js.
function trackEvent(name, detail = {}) {
  try {
    const raw = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "[]");
    const events = Array.isArray(raw) ? raw : [];
    events.push({ name, detail, at: Date.now() });
    while (events.length > ANALYTICS_MAX_EVENTS) events.shift();
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
  } catch (e) {
    // التحليلات ميزة اختيارية بحتة ويجب ألا توقف التطبيق أبدًا.
  }
}

// ===================================================================
// قائمة تحقق التحدي التفاعلية (Challenge checklist) — تحوّل لوحة
// التحدي من نص وصفي بحت إلى مهمة فعلية قابلة للإنجاز: كل بند قابل
// للتأشير ويُحفظ محليًا. اكتمال كل البنود هو الحدث الحقيقي الوحيد الذي
// يُعتبر "تحدي منجز" (يُستعمل فـ الشارات)، بدل أي ادعاء تلقائي.
// ===================================================================
// CHALLENGE_CHECKLIST_KEY منقول إلى js/core/constants.js.
function loadChallengeChecklist() {
  try {
    const raw = JSON.parse(localStorage.getItem(CHALLENGE_CHECKLIST_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}
function saveChallengeChecklist(state) {
  try { localStorage.setItem(CHALLENGE_CHECKLIST_KEY, JSON.stringify(state)); } catch (e) {}
}
function isChallengeSolved(trackId) {
  const state = loadChallengeChecklist();
  const entry = state[trackId];
  return !!(entry && entry.items && entry.items.length && entry.items.every(Boolean));
}
function countSolvedChallenges() {
  const state = loadChallengeChecklist();
  return Object.keys(state).filter(trackId => isChallengeSolved(trackId)).length;
}

// ===================================================================
// الاختبار النهائي (Final assessment) — اختبار حقيقي منفصل عن اختبارات
// الدروس الفردية (quiz)، يغطي المسار كاملًا دفعة واحدة. المحاولة الحالية
// (الإجابات المختارة قبل الإرسال) تُخزَّن فقط فـ ذاكرة الصفحة
// (assessmentDrafts)، وليس فـ localStorage، حتى لا تُعتبر "محاولة
// منجزة" قبل الضغط الفعلي على زر الإرسال. فقط النتيجة النهائية المُصحَّحة
// تُحفظ محليًا فـ ASSESSMENT_KEY. مسارات بلا حقل assessment فـ data.js
// ببساطة ما تُظهرش هاد اللوحة — بصدق، بلا "قريبًا" وهمية.
// ===================================================================
// ASSESSMENT_KEY منقول إلى js/core/constants.js.
const assessmentDrafts = {}; // trackId -> { [questionId]: optionId }، غير محفوظة فـ localStorage

// ===================================================================
// §14: سجل محاولات الاختبار النهائي (assessment attempt history)
// ===================================================================
// كان المخطط القديم يخزّن نتيجة واحدة فقط لكل مسار (state[trackId] = result)،
// تُسحق عند كل إعادة محاولة (retake). هذا يعني استحالة معرفة "هل فشل
// المستخدم من قبل" — وهي بالضبط الإشارة التي تطلبها المواصفة لترجيح
// توصية "أكمل هذا المتطلب أولًا" (مثال §14: "User failed D twice →
// recommend C before E"). المخطط الجديد { attempts: [...], latest }
// يحافظ على كل محاولة مُصحَّحة (بلا أي بيانات إضافية حساسة)، عبر
// normalizeAssessmentHistory (js/core/masar-logic.js، قابلة للاختبار
// بمعزل عن المتصفح). getAssessmentResult ما زالت ترجع "latest" فقط،
// فكل الكود القديم (renderAssessmentPanel، الشهادة...) يستمر بالعمل
// بلا أي تعديل إضافي — الترحيل شفاف بالكامل ولا يفقد أي بيانات مستخدم.
function loadAssessmentState() {
  try {
    const raw = JSON.parse(localStorage.getItem(ASSESSMENT_KEY));
    return normalizeAssessmentHistory(raw);
  } catch (e) {
    return {};
  }
}

function getAssessmentResult(trackId) {
  const entry = loadAssessmentState()[trackId];
  return entry ? entry.latest : null;
}

// عدد محاولات الفشل المتتالية الأخيرة لمسار معيّن — 0 إن لم يفشل قط
// أو إن نجح فـ آخر محاولة. تُستعمل مباشرة فـ computeRecommendationReason
// وcomputeRecommendedTracks لترجيح المتطلبات السابقة الفاشلة بشكل متكرر.
function getAssessmentFailureStreak(trackId) {
  const history = loadAssessmentState();
  return computeFailurePriorityBoost(history, trackId).failCount;
}

function saveAssessmentResult(trackId, result) {
  const state = loadAssessmentState();
  const existing = state[trackId] || { attempts: [], latest: null };
  const attempts = [...existing.attempts, result];
  state[trackId] = { attempts, latest: result };
  try {
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(state));
  } catch (e) {
    showToast(t("saveError"));
  }
  return state[trackId].latest;
}

// ملاحظة: "إعادة المحاولة" (retake) لا تحذف تاريخ المحاولات السابقة من
// ASSESSMENT_KEY أبدًا — فهذا التاريخ هو بالضبط ما يحتاجه نظام التوصيات
// ليعرف أن المستخدم فشل من قبل (§14). العرض المؤقت لنموذج الأسئلة أثناء
// إعادة المحاولة يُدار بمجموعة assessmentRetakingTracks (بلا تخزين)
// المُعرَّفة أسفل renderAssessmentPanel.

// يصحّح إجابات المستخدم مقابل correctId الحقيقي لكل سؤال. لا يوجد أي
// "تقريب" أو رقم مختلق: النسبة المئوية محسوبة مباشرة من عدد الإجابات
// الصحيحة الفعلية على العدد الكلي للأسئلة.
function gradeAssessment(track, answers) {
  const questions = track.assessment.questions;
  let correctCount = 0;
  questions.forEach(q => {
    if (answers[q.id] === q.correctId) correctCount++;
  });
  const pct = Math.round((correctCount / questions.length) * 100);
  return {
    score: correctCount,
    total: questions.length,
    pct,
    passed: pct >= (track.assessment.passThreshold || 70),
    answers: { ...answers },
    completedAt: Date.now()
  };
}

// ملاحظة: loadAssessmentState ترجع الآن { [trackId]: { attempts, latest } }
// (منذ إضافة سجل المحاولات فـ §14)، فهذه الدوال تفحص "latest" لكل
// مسار — وهو تحديدًا آخر محاولة، بنفس السلوك القديم تمامًا من منظور
// المستخدم (XP والشارات تعتمد على أحدث نتيجة، لا على كل المحاولات).
function countPassedAssessments() {
  return Object.values(loadAssessmentState()).filter(entry => entry && entry.latest && entry.latest.passed).length;
}

function countHighScoreAssessments(minPct = 90) {
  return Object.values(loadAssessmentState()).filter(entry => entry && entry.latest && entry.latest.pct >= minPct).length;
}

// مجموعة معرّفات المسارات التي يعيد المستخدم محاولة اختبارها حاليًا
// (جلسة واحدة فقط، بلا تخزين). هذا يستبدل clearAssessmentResult القديمة
// التي كانت تمحو تاريخ المحاولات بالكامل: الآن نُخفي فقط النتيجة الأخيرة
// عن العرض مؤقتًا (بار نموذج أسئلة فارغ)، بينما يبقى تاريخ المحاولات
// السابقة محفوظًا فـ ASSESSMENT_KEY — وهو بالضبط ما يحتاجه نظام
// التوصيات (getAssessmentFailureStreak) ليعرف أن المستخدم فشل من قبل.
const assessmentRetakingTracks = new Set();

function renderAssessmentPanel(categoryId, trackId, track) {
  const wrap = document.getElementById("assessmentWrap");
  if (!wrap) return;

  // بصدق: مسارات بلا بيانات اختبار نهائي فـ data.js ما تُظهرش هاد
  // اللوحة إطلاقًا، بدل عرض زر لا يفعل شيئًا.
  if (!track.assessment || !Array.isArray(track.assessment.questions) || !track.assessment.questions.length) {
    wrap.replaceChildren();
    return;
  }

  const questions = track.assessment.questions;
  const passThreshold = track.assessment.passThreshold || 70;
  const isRetaking = assessmentRetakingTracks.has(trackId);
  const result = isRetaking ? null : getAssessmentResult(trackId);
  const draft = assessmentDrafts[trackId] || (assessmentDrafts[trackId] = {});

  const header = el("div", { class: "panel-header" }, [
    el("span", { class: "panel-title", text: t("assessmentTitle") }),
    result
      ? el("span", { class: "panel-tag" + (result.passed ? " panel-tag-solved" : ""), text: result.passed ? t("assessmentPassed") : t("assessmentFailed") })
      : null
  ]);

  const body = [];

  if (result) {
    body.push(el("p", { class: "panel-lead", text: `${t("assessmentScoreLabel")}: ${result.pct}% (${result.score}/${result.total})` }));
    body.push(el("p", { class: "mastery-hint", text: t("assessmentPassThreshold", { pct: passThreshold }) }));
    body.push(el("p", { class: "mastery-hint", text: t("assessmentCompletedOn", { date: new Date(result.completedAt).toLocaleDateString(currentLang) }) }));

    const reviewList = el("div", { class: "assessment-review" });
    questions.forEach((q, idx) => {
      const chosenId = result.answers[q.id];
      const isCorrect = chosenId === q.correctId;
      const optionsWrap = el("div", { class: "quiz-options" });
      q.options.forEach(opt => {
        const classes = ["quiz-option", "quiz-option-static"];
        if (opt.id === q.correctId) classes.push("quiz-option-correct");
        else if (opt.id === chosenId) classes.push("quiz-option-incorrect");
        optionsWrap.appendChild(el("div", { class: classes.join(" ") }, [tr(opt.text)]));
      });
      reviewList.appendChild(el("div", { class: "assessment-question" }, [
        el("p", { class: "quiz-question", text: `${t("assessmentQuestionOf", { current: idx + 1, total: questions.length })} — ${tr(q.prompt)}` }),
        optionsWrap,
        el("p", { class: "practice-feedback-detail", text: `${isCorrect ? t("assessmentReviewCorrect") : t("assessmentReviewIncorrect")}. ${tr(q.explanation)}` })
      ]));
    });
    body.push(reviewList);

    body.push(el("button", {
      type: "button",
      class: "btn-back",
      text: t("assessmentRetake"),
      onclick: () => {
        assessmentDrafts[trackId] = {};
        assessmentRetakingTracks.add(trackId);
        renderLessonList(categoryId, trackId);
      }
    }));
  } else {
    body.push(el("p", { class: "panel-lead", text: t("assessmentIntro") }));

    questions.forEach((q, idx) => {
      const optionsWrap = el("div", { class: "quiz-options" });
      q.options.forEach(opt => {
        const isSelected = draft[q.id] === opt.id;
        optionsWrap.appendChild(el("button", {
          type: "button",
          class: "quiz-option" + (isSelected ? " quiz-option-correct" : ""),
          onclick: () => {
            draft[q.id] = opt.id;
            renderAssessmentPanel(categoryId, trackId, track);
          }
        }, [tr(opt.text)]));
      });
      body.push(el("div", { class: "assessment-question" }, [
        el("p", { class: "quiz-question", text: `${t("assessmentQuestionOf", { current: idx + 1, total: questions.length })} — ${tr(q.prompt)}` }),
        optionsWrap
      ]));
    });

    const allAnswered = questions.every(q => !!draft[q.id]);
    if (!allAnswered) {
      body.push(el("p", { class: "mastery-hint", text: t("assessmentAnswerAllHint") }));
    }

    const submitAttrs = {
      type: "button",
      class: "btn-primary",
      text: t("assessmentSubmit"),
      onclick: () => {
        if (!questions.every(q => !!draft[q.id])) return;
        const graded = gradeAssessment(track, draft);
        saveAssessmentResult(trackId, graded);
        assessmentRetakingTracks.delete(trackId);
        trackEvent("assessment_completed", { trackId, pct: graded.pct, passed: graded.passed });
        // §32: كانت computeProgressSummary() (تمرّ على كل SKILL_DATA) تُستدعى
        // ثلاث مرات متتالية هنا بلا داعٍ لنفس اللحظة الزمنية بالضبط — نتيجة
        // واحدة محسوبة مرة واحدة ومُعاد استعمالها فـ الثلاثة استدعاءات كافية
        // تمامًا ونفس السلوك، بلا أي عمل حسابي مكرر.
        const summary = computeProgressSummary();
        checkNewAchievements(summary, currentStreak);
        renderDashboard(summary);
        renderRecommended(summary);
        renderLessonList(categoryId, trackId);
      }
    };
    if (!allAnswered) submitAttrs.disabled = true;
    body.push(el("button", submitAttrs));
  }

  wrap.replaceChildren(el("div", { class: "assessment-panel" }, [header, ...body.filter(Boolean)]));
}

// ===================================================================
// أدوات عامة
// ===================================================================
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ===================================================================
// اللغة والثيم — واجهة المستخدم
// ===================================================================
function applyLanguageUI() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = isRtlLanguage(currentLang) ? "rtl" : "ltr";
  document.title = `${t("appName")} — ${t("appTagline")}`;
  document.getElementById("appName").textContent = t("appName");
  document.getElementById("appTagline").textContent = t("appTagline");
  document.getElementById("streakLabel").textContent = t("streakLabel");
  document.getElementById("heroKicker").textContent = t("today");
  document.getElementById("statCompletedLabel").textContent = t("statCompletedLabel");
  document.getElementById("statBooksLabel").textContent = t("statBooksLabel");
  document.getElementById("statFinishedLabel").textContent = t("statFinishedLabel");
  document.getElementById("searchInput").placeholder = t("searchPlaceholder");
  document.getElementById("searchInput").setAttribute("aria-label", t("searchPlaceholder"));
  document.getElementById("searchInputLabel").textContent = t("searchLabel");
  document.getElementById("skipLink").textContent = t("skipToContent");
  document.getElementById("shelfNav").setAttribute("aria-label", t("categories"));
  document.getElementById("backToShelf").textContent = t("backToShelf");
  document.getElementById("resetProgress").textContent = t("resetProgress");
  document.getElementById("langSwitcher").setAttribute("aria-label", t("language"));
  document.getElementById("langSwitcher").value = currentLang;
  document.getElementById("exportBtn").setAttribute("aria-label", t("exportProgress"));
  document.getElementById("exportBtn").title = t("exportProgress");
  document.getElementById("importBtn").setAttribute("aria-label", t("importProgress"));
  document.getElementById("importBtn").title = t("importProgress");
  document.getElementById("resetAllBtn").setAttribute("aria-label", t("resetAll"));
  document.getElementById("resetAllBtn").title = t("resetAll");
  document.getElementById("shareBtn").setAttribute("aria-label", t("shareProgress"));
  document.getElementById("shareBtn").title = t("shareProgress");
  document.getElementById("installBtn").setAttribute("aria-label", t("installApp"));
  document.getElementById("installBtn").title = t("installApp");
  document.getElementById("onlineStatus").textContent = navigator.onLine ? t("statusOnline") : t("statusOffline");
  document.getElementById("onlineStatus").classList.toggle("online", navigator.onLine);
  document.getElementById("onlineStatus").classList.toggle("offline", !navigator.onLine);
  document.getElementById("achievementsTitle").textContent = t("achievementsTitle");
  document.getElementById("portfolioTitle").textContent = t("portfolioTitle");
  document.getElementById("insightTitle").textContent = t("insightTitle");
  document.getElementById("journalTitle").textContent = t("journalTitle");
  document.getElementById("planTitle").textContent = t("planTitle");
  document.getElementById("quickPlanTitle").textContent = t("quickPlanTitle");
  document.getElementById("onboardingTitle").textContent = t("onboardingTitle");
  document.getElementById("onboardingGoalQuestion").textContent = t("onboardingGoalQuestion");
  document.getElementById("onboardingLevelQuestion").textContent = t("onboardingLevelQuestion");
  const timeQ = document.getElementById("onboardingTimeQuestion");
  if (timeQ) timeQ.textContent = t("onboardingTimeQuestion");
  const pathsTitleEl = document.getElementById("pathsTitle");
  if (pathsTitleEl) pathsTitleEl.textContent = t("pathsTitle");
  const dailyQueueTitleEl = document.getElementById("dailyQueueTitle");
  if (dailyQueueTitleEl) dailyQueueTitleEl.textContent = t("dailyQueueTitle");
  const mentorTitleEl = document.getElementById("mentorTitle");
  if (mentorTitleEl) mentorTitleEl.textContent = t("mentorTitle");
  document.getElementById("onboardingSkipBtn").textContent = t("onboardingSkip");
  document.getElementById("onboardingSaveBtn").textContent = t("onboardingSave");
  document.getElementById("recommendedTitle").textContent = t("recommendedTitle");
  document.getElementById("reviewTitle").textContent = t("reviewTitle");
  document.getElementById("editPrefsBtn").textContent = t("editPreferences");
  if (!document.getElementById("onboardingOverlay").classList.contains("hidden")) renderOnboardingOptions();
  updateThemeToggle(document.documentElement.getAttribute("data-theme") || "light");
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    // اللغة المختارة تبقى فعّالة لهذه الجلسة حتى لو تعذّر حفظها.
  }
  applyLanguageUI();
  renderAll();
  if (currentTrackRef) openTrack(currentTrackRef.categoryId, currentTrackRef.trackId, false);
}

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";
  const theme = isDark ? "light" : "dark";
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    showToast(t("themeSaveError"));
  }
  updateThemeToggle(theme);
}

function updateThemeToggle(theme) {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const isDark = theme === "dark";
  toggle.replaceChildren(el("span", { "aria-hidden": "true", text: isDark ? "☀️" : "🌙" }));
  toggle.setAttribute("aria-label", isDark ? t("lightMode") : t("darkMode"));
  toggle.setAttribute("aria-pressed", String(isDark));
  toggle.title = isDark ? t("lightMode") : t("darkMode");
}

function updateConnectionStatus() {
  const statusEl = document.getElementById("onlineStatus");
  if (!statusEl) return;
  const isOnline = navigator.onLine;
  statusEl.textContent = isOnline ? t("statusOnline") : t("statusOffline");
  statusEl.classList.toggle("online", isOnline);
  statusEl.classList.toggle("offline", !isOnline);
}

function applySavedTheme() {
  let theme = "light";
  try {
    theme = localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch (e) {
    // الوضع الفاتح افتراضيًا إذا تعذّر الوصول إلى localStorage.
  }
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggle(theme);
}

// ===================================================================
// عرض شريط التنقل بين الفئات
// ===================================================================
function renderShelfNav() {
  const nav = document.getElementById("shelfNav");
  nav.replaceChildren();

  const allChip = el("button", {
    type: "button",
    class: "shelf-chip" + (activeCategory === "all" ? " active" : ""),
    text: t("allShelves"),
    "aria-current": activeCategory === "all" ? "page" : undefined,
    onclick: () => { activeCategory = "all"; renderAll(); }
  });
  nav.appendChild(allChip);

  SKILL_DATA.forEach(cat => {
    const chip = el("button", {
      type: "button",
      class: "shelf-chip" + (activeCategory === cat.id ? " active" : ""),
      text: tr(cat.name),
      "aria-current": activeCategory === cat.id ? "page" : undefined,
      onclick: () => { activeCategory = cat.id; renderAll(); }
    });
    nav.appendChild(chip);
  });
}

// ===================================================================
// عرض الأرفف والكتب
// ===================================================================
function buildBookCard(cat, track, info, reason = null) {
  const done = info.done, pct = info.pct;
  const finished = info.total > 0 && done === info.total;
  const levelLabels = TRACK_LEVEL_LABELS[track.level];

  const ribbon = el("div", { class: "book-ribbon" });
  ribbon.style.height = Math.max(pct, 8) + "%";

  const meta = el("div", { class: "book-meta" }, [
    el("span", { class: `track-level level-${track.level}`, text: levelLabels[currentLang] || levelLabels.en }),
    el("span", { class: "track-duration", text: tr(track.duration) })
  ]);

  const titleDiv = el("div", { class: "book-title", text: tr(track.title) });

  const miniFill = el("div");
  miniFill.style.width = pct + "%";
  const miniProgress = el("div", { class: "book-mini-progress" }, [miniFill]);

  const footer = el("div", {}, [
    el("div", { class: "book-progress-label", text: t("pageCount", { done, total: info.total }) }),
    miniProgress
  ]);

  const cardChildren = [ribbon, meta, titleDiv, footer];

  if (reason) {
    cardChildren.push(el("div", { class: "book-reason", text: reason }));
  }

  // تلميح غير حاجب: إن كان لهذا المسار متطلبات سابقة لم تُنجَز بعد،
  // نعرض اسم أول واحد منها فقط (تفاديًا لازدحام البطاقة). المستخدم
  // يبقى قادرًا على فتح المسار مباشرة رغم ذلك.
  if (done === 0 && !finished) {
    const incomplete = getIncompletePrerequisites(track);
    if (incomplete.length) {
      cardChildren.push(el("div", {
        class: "book-prereq-hint",
        text: t("suggestedAfter", { title: tr(incomplete[0].track.title) })
      }));
    }
  }

  const card = el("button", {
    type: "button",
    class: "book-card",
    "data-track-key": `${cat.id}::${track.id}`,
    "aria-label": finished ? `${tr(track.title)} — ${t("statFinishedLabel")}` : tr(track.title),
    onclick: () => openTrack(cat.id, track.id)
  }, cardChildren);
  card.style.background = cat.spineColor;

  if (finished) {
    card.appendChild(el("div", { class: "book-done-badge", text: "✅", "aria-hidden": "true" }));
  }

  return card;
}

// scoreTrackAgainstSearch (بحث الأرفف المبني على تسجيل نقاط لكل كلمة عبر
// عدة حقول) منقولة الآن إلى js/core/masar-logic.js، بنفس المنطق تمامًا،
// ومُختبرة بمعزل عن الترجمة الحقيقية فـ tests/masar-logic.test.js.

// §22: البحث يشمل الآن LEARNING_PATHS أيضًا، لا فقط المسارات/الدروس/
// الفئات. تبني/تحدّث قسم "مسارات مهنية مطابقة" فوق الأرفف مباشرة، ولا
// يظهر إلا حين يوجد بحث فعلي (searchTokens.length) ونتائج حقيقية.
function renderSearchPathMatches(searchTokens) {
  let box = document.getElementById("searchPathMatches");
  if (!box) {
    box = el("div", { id: "searchPathMatches", class: "search-path-matches hidden" });
    const container = document.getElementById("shelvesContainer");
    container.parentNode.insertBefore(box, container);
  }

  if (!searchTokens.length || typeof LEARNING_PATHS === "undefined") {
    box.classList.add("hidden");
    return;
  }

  const matches = LEARNING_PATHS
    .map(path => ({ path, score: scorePathAgainstSearch(path, searchTokens) }))
    .filter(entry => entry.score !== null)
    .sort((a, b) => b.score - a.score);

  if (!matches.length) {
    box.classList.add("hidden");
    return;
  }

  box.replaceChildren(
    el("div", { class: "shelf-title" }, [
      el("span", { text: t("searchPathsHeading") })
    ]),
    el("div", { class: "paths-grid" }, matches.map(({ path }) => {
      const progress = computeLearningPathProgress(path);
      const fill = el("div", { class: "path-progress-fill" });
      fill.style.width = progress.pct + "%";
      return el("button", {
        type: "button",
        class: "path-card" + (progress.finished ? " path-finished" : ""),
        onclick: () => {
          if (progress.nextStep) openTrack(progress.nextStep.categoryId, progress.nextStep.trackId);
          else if (path.steps[0]) openTrack(path.steps[0].categoryId, path.steps[0].trackId);
        }
      }, [
        el("div", { class: "path-card-head" }, [
          el("span", { class: "path-icon", "aria-hidden": "true", text: path.icon || "🧭" }),
          el("strong", { class: "path-title", text: tr(path.title) })
        ]),
        el("p", { class: "path-desc", text: tr(path.description) }),
        el("div", { class: "path-progress-track" }, [fill]),
        el("span", { class: "path-progress-label", text: progress.finished ? t("pathFinished") : t("pathProgressLabel", { pct: progress.pct }) })
      ]);
    }))
  );
  box.classList.remove("hidden");
}

function renderShelves(summary) {
  const container = document.getElementById("shelvesContainer");
  container.replaceChildren();

  const categories = activeCategory === "all"
    ? SKILL_DATA
    : SKILL_DATA.filter(c => c.id === activeCategory);
  const searchTokens = searchQuery ? searchQuery.split(/\s+/).filter(Boolean) : [];
  renderSearchPathMatches(searchTokens);
  let matchingCategoryCount = 0;

  categories.forEach(cat => {
    let matchingTracks = cat.tracks
      .map(track => ({ track, score: scoreTrackAgainstSearch(cat, track, searchTokens) }))
      .filter(entry => entry.score !== null);
    if (searchTokens.length) matchingTracks.sort((a, b) => b.score - a.score);
    matchingTracks = matchingTracks.map(entry => entry.track);

    if (matchingTracks.length === 0) return;
    matchingCategoryCount++;

    const title = el("div", { class: "shelf-title" }, [
      el("span", { text: tr(cat.name) }),
      el("span", { class: "count", text: t("booksCount", { count: matchingTracks.length }) })
    ]);

    const row = el("div", { class: "books-row" });
    matchingTracks.forEach(track => {
      const info = summary.perTrack.get(`${cat.id}::${track.id}`);
      row.appendChild(buildBookCard(cat, track, info));
    });

    container.appendChild(el("div", { class: "shelf-block" }, [title, row]));
  });

  if (matchingCategoryCount === 0) {
    container.appendChild(el("p", { class: "search-empty", text: t("noResults") }));
  }
}

// ===================================================================
// لوحة القراءة (الصفحة الرئيسية)
// ===================================================================
function buildInsightSummary(summary) {
  const dueReviews = getDueReviews(10).length;
  const practiceCount = Object.keys(loadPracticeNotes()).length;
  const weeklyTarget = Math.max(3, Math.min(8, 3 + Math.max(0, userPrefs.goal ? 1 : 0)));
  const goalProgress = Math.min(100, Math.round((summary.totalDone / weeklyTarget) * 100));
  const focusTrack = findContinueTrack(summary);
  const backupStamp = (() => {
    try {
      const raw = localStorage.getItem(DATA_BACKUP_KEY);
      return raw ? new Date(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  return {
    goalProgress,
    goalLabel: userPrefs.goal ? tr(SKILL_DATA.find(cat => cat.id === userPrefs.goal)?.name || { en: "Learning" }) : t("profileGeneral"),
    dueReviews,
    practiceCount,
    focusTitle: focusTrack.track ? tr(focusTrack.track.title) : t("journalFocus"),
    backupHealthy: !!backupStamp && (Date.now() - backupStamp.getTime()) < 1000 * 60 * 60 * 24 * 7,
    backupStamp
  };
}

function renderInsightPanel(summary) {
  const section = document.getElementById("insightSection");
  const grid = document.getElementById("insightGrid");
  if (!section || !grid) return;

  const data = buildInsightSummary(summary);
  const items = [
    { label: t("insightDailyGoal"), value: `${data.goalProgress}%`, note: `${data.goalLabel}` },
    { label: t("insightReview"), value: String(data.dueReviews), note: t("insightReviewHint") },
    { label: t("insightPractice"), value: String(data.practiceCount), note: t("insightPracticeHint") },
    { label: t("insightStorage"), value: data.backupHealthy ? t("insightHealthy") : t("insightNeedsBackup"), note: data.backupHealthy ? t("insightStorageHint") : t("insightBackupHint") }
  ];

  grid.replaceChildren();
  items.forEach(item => {
    grid.appendChild(el("div", { class: "insight-card" }, [
      el("span", { class: "insight-label", text: item.label }),
      el("strong", { class: "insight-value", text: item.value }),
      el("span", { class: "insight-note", text: item.note })
    ]));
  });

  section.classList.remove("hidden");
}

// ===================================================================
// طيّ لوحات لوحة القيادة (Dashboard panel collapse) — القسم 23 من
// المواصفة حذّر صراحة من إثقال الشاشة الرئيسية. بدل حذف أي لوحة (كل
// واحدة منها مفيدة لبعض المستخدمين)، نتيح للمستخدم طيّها يدويًا، بحالة
// محفوظة محليًا (DASHBOARD_COLLAPSE_KEY) فتبقى مطوية عبر الجلسات. هذا
// تفضيل عرض بحت — لا يمس أي بيانات تقدم حقيقية.
// ===================================================================
function loadDashboardCollapseState() {
  try {
    const raw = JSON.parse(localStorage.getItem(DASHBOARD_COLLAPSE_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}
function saveDashboardCollapseState(state) {
  try { localStorage.setItem(DASHBOARD_COLLAPSE_KEY, JSON.stringify(state)); } catch (e) { /* تفضيل عرض بحت */ }
}

// ===================================================================
// §23: لوحة قيادة أقل ازدحامًا افتراضيًا — بدون حذف أي لوحة
// ===================================================================
// كانت كل اللوحات الاثنتي عشرة+ تظهر موسّعة افتراضيًا (طيّها كان يدويًا
// بحتًا)، فالصفحة الرئيسية تُغرق المستخدم الجديد بمعلومات كثيرة قبل أن
// يفهم "ماذا أفعل الآن؟" — بالضبط المشكلة التي يحذّر منها §23 صراحة.
// الحل هنا ليس حذف أي لوحة (كل واحدة مفيدة لبعض المستخدمين)، بل تعيين
// حالة ابتدائية ذكية: اللوحات "الأساسية" (تتابع، اليوم، المرشد، موصى
// به، المراجعة) مفتوحة افتراضيًا لأنها تجيب مباشرة عن "ماذا أفعل الآن؟"
// (بنية §23 المقترحة)، بينما اللوحات "الثانوية" (تحليلية/استكشافية أكثر
// من كونها فعل فوري) تبدأ مطوية افتراضيًا. أي تفضيل يدوي سابق من
// المستخدم (فـ أي الاتجاهين) يبقى محترمًا تمامًا ولا يُكتب فوقه أبدًا،
// لأن المخطط تحوّل الآن لتخزين true/false صراحة لكل لوحة لمسها المستخدم
// (بدل حذف المفتاح عند "غير مطوي" كما كان سابقًا)، فيمكننا التمييز
// بدقة بين "لم يلمسها المستخدم بعد" (نطبّق الافتراضي الذكي) و"طواها/
// فتحها المستخدم يدويًا" (نحترم اختياره للأبد).
const DASHBOARD_SECONDARY_PANELS = new Set([
  "insightSection", "journalSection", "planSection", "portfolioSection",
  "projectLibrarySection", "communitySection", "quickPlanSection", "pathsSection"
]);

function applyDashboardCollapseState() {
  const state = loadDashboardCollapseState();
  document.querySelectorAll(".dashboard-panel").forEach(panel => {
    panel.classList.add("collapsible");
    const storedPreference = state[panel.id];
    const collapsed = typeof storedPreference === "boolean"
      ? storedPreference
      : DASHBOARD_SECONDARY_PANELS.has(panel.id); // لا تفضيل محفوظ بعد → الافتراضي الذكي
    panel.classList.toggle("collapsed", collapsed);
  });
}
// تفويض حدث واحد على document (بدل ربط مستمع فـ كل إعادة رسم، الذي كان
// سيتراكم مستمعات مكررة لأن replaceChildren لا يعيد بناء .shelf-title
// نفسها فـ كل استدعاء renderDashboard).
document.addEventListener("click", e => {
  if (e.target.closest("button, a")) return; // لا نطوي عند الضغط على "تعديل التفضيلات" مثلاً
  const title = e.target.closest(".dashboard-panel.collapsible > .shelf-title");
  if (!title) return;
  const panel = title.parentElement;
  if (!panel || !panel.id) return;
  panel.classList.toggle("collapsed");
  // §23: نُخزّن الآن true أو false صراحة (بدل حذف المفتاح عند الفتح)،
  // حتى يُميَّز "المستخدم فتحها يدويًا" عن "لم يلمسها بعد" فـ
  // applyDashboardCollapseState أعلاه — وإلا كانت اللوحات الثانوية
  // ستعود لحالتها المطوية الافتراضية بمجرد أي إعادة رسم، رغم أن
  // المستخدم فتحها بنفسه للتو.
  const state = loadDashboardCollapseState();
  state[panel.id] = panel.classList.contains("collapsed");
  saveDashboardCollapseState(state);
});

function renderDashboard(summary) {
  document.getElementById("statCompleted").textContent = summary.totalDone;
  document.getElementById("statBooks").textContent = summary.booksInProgress;
  document.getElementById("statFinished").textContent = summary.booksFinished;

  const cont = findContinueTrack(summary);
  const titleEl = document.getElementById("continueTitle");
  const descEl = document.getElementById("continueDesc");
  const btn = document.getElementById("continueBtn");

  if (cont.done > 0) {
    titleEl.textContent = t("continueTitle", { title: tr(cont.track.title) });
    descEl.textContent = t("continueDesc", { done: cont.done, total: cont.track.lessons.length });
    btn.textContent = t("continueReading");
  } else {
    titleEl.textContent = t("startTitle");
    descEl.textContent = t("tryTitle", { title: tr(cont.track.title) });
    btn.textContent = t("startNow");
  }
  btn.onclick = () => openTrack(cont.category.id, cont.track.id);

  document.getElementById("streakNum").textContent = currentStreak.count;
  renderLevelBadge(summary);
  renderAchievements(summary, currentStreak);
  renderLearningPaths(summary);
  renderPortfolioSummary(summary);
  renderInsightPanel(summary);
  renderLearningJournal(summary);
  renderLearningPlan();
  renderDailyQueue(summary);
  renderQuickPlan(summary);
  renderMentorPanel(summary);
  renderReviewQueue();
  // خطاطيف اختيارية نحو ملفات جديدة (project-workspace.js / community.js).
  // فحص دفاعي: غياب أحد هذه الملفات لا يكسر باقي اللوحة.
  if (typeof window.masarRenderProjectLibrary === "function") window.masarRenderProjectLibrary(summary);
  if (typeof window.masarRenderCommunity === "function") window.masarRenderCommunity();
  applyDashboardCollapseState();
}

// ===================================================================
// عرض صفحة الكتاب (المسار)
// ===================================================================
function showTrackNotFound() {
  document.getElementById("trackContent").classList.add("hidden");
  const notFound = document.getElementById("trackNotFound");
  notFound.classList.remove("hidden");
  document.getElementById("notFoundTitle").textContent = t("trackNotFoundTitle");
  document.getElementById("notFoundDesc").textContent = t("trackNotFoundDesc");
  document.getElementById("notFoundBrowseBtn").textContent = t("browseShelves");
}

function openTrack(categoryId, trackId, updateHistory = true) {
  trackEvent("track_opened", { categoryId, trackId });
  currentTrackRef = { categoryId, trackId };
  try {
    localStorage.setItem(LAST_VIEW_KEY, JSON.stringify({ categoryId, trackId, savedAt: Date.now() }));
  } catch (e) {
    // لا تعطل التطبيق إذا لم يتوفر التخزين.
  }
  const result = findTrack(categoryId, trackId);

  document.getElementById("dashboardView").classList.add("hidden");
  document.getElementById("trackView").classList.remove("hidden");

  if (!result || !result.track) {
    // لا ندفع حالة history لمسار غير موجود أصلاً (رابط قديم/تالف)،
    // بذلك لا يبقى في history entry يشير إلى مسار لا وجود له.
    showTrackNotFound();
    return;
  }

  if (updateHistory) {
    history.pushState({ view: "track", categoryId, trackId }, "", `#track-${categoryId}-${trackId}`);
    hasPushedTrackState = true;
  }

  document.getElementById("trackNotFound").classList.add("hidden");
  document.getElementById("trackContent").classList.remove("hidden");

  const { category, track } = result;
  document.getElementById("trackSpine").style.background = category.spineColor;
  document.getElementById("trackAuthor").textContent = tr(track.author);
  const levelEl = document.getElementById("trackLevel");
  levelEl.textContent = TRACK_LEVEL_LABELS[track.level][currentLang] || TRACK_LEVEL_LABELS[track.level].en;
  levelEl.className = `track-level level-${track.level}`;
  document.getElementById("trackDuration").textContent = tr(track.duration);
  document.getElementById("trackTitle").textContent = tr(track.title);
  document.getElementById("trackSummary").textContent = tr(track.summary);

  renderLessonList(categoryId, trackId);
  const supportsSmoothScroll = "scrollBehavior" in document.documentElement.style;
  window.scrollTo(supportsSmoothScroll
    ? { top: 0, behavior: "smooth" }
    : { top: 0 });
}

// يمنع إعادة إرسال حدث lesson_started عدة مرات لنفس الدرس فـ نفس الجلسة
// (renderLessonList يُستدعى فـ كل تحديث لصفحة المسار، لا فقط عند أول فتح).
const lessonStartedThisSession = new Set();

function buildLessonItem(categoryId, trackId, lesson, idx, isDone) {
  if (!isDone && !lessonStartedThisSession.has(lesson.id)) {
    lessonStartedThisSession.add(lesson.id);
    trackEvent("lesson_started", { categoryId, trackId, lessonId: lesson.id });
  }
  const li = el("li", { class: "lesson-item" + (isDone ? " done" : "") });

  const checkbox = el("button", {
    class: "lesson-checkbox" + (isDone ? " checked" : ""),
    "aria-label": isDone ? t("lessonUndone") : t("lessonDone"),
    text: isDone ? "✓" : String(idx + 1),
    onclick: () => {
      const nowDone = !isDone;
      const ok = progressRepository.setLessonDone(categoryId, trackId, lesson.id, nowDone);
      if (ok && nowDone) {
        trackEvent("lesson_completed", { categoryId, trackId, lessonId: lesson.id });
        const streak = bumpStreak();
        scheduleLessonReview(lesson.id, 4);
        showToast(t("lessonDoneToast", { count: streak.count }));
      } else if (ok && !nowDone) {
        scheduleLessonReview(lesson.id, 2);
      }
      const summary = computeProgressSummary();
      renderRecommended(summary);
      renderShelves(summary);
      renderDashboard(summary);
      renderLessonList(categoryId, trackId);
      checkSkillMasteryAndPathEvents(categoryId, trackId, summary);
    }
  });

  const body = el("div", { class: "lesson-body" });
  body.appendChild(el("h3", { text: tr(lesson.title) }));
  // §5: تلميح غير حاجب (soft) إن كان للدرس متطلبات دروس سابقة لم تُنجَز
  // بعد، على مستوى الدرس المفرد (بخلاف التلميح الموجود أصلاً على مستوى
  // المسار الكامل فـ buildBookCard). لا يمنع فتح الدرس أبدًا.
  if (lesson.requires && lesson.requires.length) {
    const result = findTrack(categoryId, trackId);
    const trackLessons = result && result.track ? result.track.lessons : [];
    const completed = progressRepository.getCompletedLessons(categoryId, trackId);
    const incomplete = getIncompleteLessonPrerequisites(lesson, trackLessons, completed);
    if (incomplete.length) {
      body.appendChild(el("p", {
        class: "lesson-prereq-hint",
        text: t("lessonPrereqHint", { title: tr(incomplete[0].title) })
      }));
    }
  }
  if (lesson.explain) body.appendChild(el("p", { class: "lesson-explain", text: tr(lesson.explain) }));
  if (lesson.tools && lesson.tools.length) {
    const toolsWrap = el("div", { class: "lesson-tools", "aria-label": t("skillToolsLabel") });
    lesson.tools.forEach(toolName => {
      toolsWrap.appendChild(el("span", { class: "tool-tag", text: toolName }));
    });
    body.appendChild(toolsWrap);
  }
  if (lesson.why) body.appendChild(el("p", { class: "lesson-why", text: tr(lesson.why) }));
  if (lesson.example) body.appendChild(el("p", { class: "lesson-example", text: tr(lesson.example) }));
  if (lesson.code) {
    const code = el("code", { class: `language-${lesson.codeLang || "plaintext"}`, text: lesson.code });
    body.appendChild(el("pre", { class: "lesson-code" }, [code]));
  }
  if (lesson.commonMistake) {
    const mistakeWrap = el("p", { class: "lesson-mistake" }, [
      el("span", { class: "lesson-mistake-label", text: t("commonMistakeLabel") }),
      tr(lesson.commonMistake)
    ]);
    body.appendChild(mistakeWrap);
  }
  if (lesson.resources && lesson.resources.length) {
    const resWrap = el("div", { class: "lesson-resources" });
    lesson.resources.forEach(resource => {
      resWrap.appendChild(el("a", {
        class: "resource-link",
        href: resource.url,
        target: "_blank",
        rel: "noopener noreferrer"
      }, [
        el("span", { "aria-hidden": "true", class: "resource-icon", text: "↗" }),
        resource.label
      ]));
    });
    body.appendChild(resWrap);
  }
  body.appendChild(el("p", { class: "lesson-tip", text: tr(lesson.tip) }));
  body.appendChild(buildPracticeBox(lesson));
  // خطوة "التأمل" (Reflection) الصريحة: سؤال تفكير بحت بلا حقل إدخال
  // (بخلاف practice box الذي يطلب إجابة نصية)، يتبع بنية القسم 8 من
  // المواصفة: Context → Concept → Example → Interaction → Practice →
  // Quick check → Reflection → Next step. سؤال ثابت عمدًا (لا يحتاج
  // بيانات إضافية لكل درس فـ data.js) لتفادي تضخيم كل درس بحقل جديد.
  body.appendChild(el("div", { class: "reflection-box" }, [
    el("span", { class: "reflection-label", text: t("reflectionLabel") }),
    el("p", { class: "reflection-question", text: t("reflectionQuestion") })
  ]));
  const quizBox = buildQuizBox(lesson);
  if (quizBox) body.appendChild(quizBox);
  // محرك التمارين الموسّع (true/false، fill-blank، ordering، matching) معرّف
  // فـ exercises.js (ملف منفصل بدل تضخيم app.js أكثر). الفحص الدفاعي هنا
  // يضمن أن غياب/تعطل ذلك الملف لا يوقف صفحة الدرس بأكملها.
  if (typeof window.masarBuildExerciseBoxes === "function") {
    const exerciseBoxes = window.masarBuildExerciseBoxes(lesson);
    if (exerciseBoxes) body.appendChild(exerciseBoxes);
  }
  body.appendChild(buildHelpfulBox(lesson.id));

  li.appendChild(checkbox);
  li.appendChild(body);
  return li;
}

// يبني عنصر شريط تقدم صغير واحد (تسمية + شريط + نسبة) لاستخدامه داخل
// لوحة الإتقان.
function buildMasteryBar(labelKey, pct) {
  const fill = el("div", { class: "mastery-bar-fill" });
  fill.style.width = pct + "%";
  return el("div", { class: "mastery-row" }, [
    el("span", { class: "mastery-row-label", text: t(labelKey) }),
    el("div", { class: "mastery-bar-track" }, [fill]),
    el("span", { class: "mastery-row-pct", text: pct + "%" })
  ]);
}

function renderMasteryPanel(categoryId, trackId, track) {
  const wrap = document.getElementById("masteryWrap");
  if (!wrap) return;
  wrap.replaceChildren();

  const mastery = computeTrackMastery(categoryId, trackId, track);
  if (!mastery) return; // مسار بلا دروس أصلًا (لا يحدث حاليًا، لكن نتحوط)

  const header = el("div", { class: "mastery-header" }, [
    el("span", { class: "mastery-title", text: t("masteryPanelTitle") }),
    el("span", { class: `mastery-pill mastery-pill-${mastery.state}`, text: t("masteryState_" + mastery.state) })
  ]);

  const rows = el("div", { class: "mastery-rows" }, [
    buildMasteryBar("masteryKnowledgeLabel", mastery.knowledgePct),
    buildMasteryBar("masteryPracticeLabel", mastery.practicePct),
    buildMasteryBar("masteryChallengeLabel", mastery.challengePct),
    buildMasteryBar("masteryProjectLabel", mastery.projectPct)
  ]);

  // §6: نعرض الآن رقمًا حقيقيًا لو توفرت مراجعات كافية (retentionPct
  // ليست null)، وإلا نبقي الرسالة الصادقة "لا بيانات كافية بعد" —
  // بدون أي تقريب أو تخمين، تمامًا كما كان السلوك السابق فـ الحالة
  // الفارغة.
  const retentionRow = mastery.retentionPct !== null
    ? buildMasteryBar("masteryRetentionLabel", mastery.retentionPct)
    : el("div", { class: "mastery-row mastery-row-pending" }, [
        el("span", { class: "mastery-row-label", text: t("masteryRetentionLabel") }),
        el("span", { class: "mastery-row-pending-note", text: t("masteryRetentionPending") })
      ]);
  rows.appendChild(retentionRow);

  const overallFill = el("div", { class: "mastery-overall-fill" });
  overallFill.style.width = mastery.overallPct + "%";
  const overall = el("div", { class: "mastery-overall" }, [
    el("span", { class: "mastery-row-label", text: t("masteryOverallLabel") }),
    el("div", { class: "mastery-bar-track mastery-bar-track-lg" }, [overallFill]),
    el("span", { class: "mastery-row-pct", text: mastery.overallPct + "%" })
  ]);

  const hint = el("p", { class: "mastery-hint", text: t("masteryHint") });
  // إجابة صريحة على "لماذا مهارتي عند X%؟": نفصح عن معادلة الحساب
  // الفعلية (35% معرفة + 25% تطبيق + 20% تحدٍ + 20% مشروع) بدل ترك
  // الرقم بلا تفسير، بعد تحديث §6 لدمج التحدي والمشروع فـ الحساب.
  const explain = el("p", { class: "mastery-hint", text: t("masteryExplain", {
    knowledge: mastery.knowledgePct, practice: mastery.practicePct,
    challenge: mastery.challengePct, project: mastery.projectPct
  }) });

  wrap.appendChild(el("div", { class: "mastery-panel" }, [header, rows, overall, hint, explain]));
}

function buildTrackEvidence(categoryId, trackId, track) {
  const mastery = computeTrackMastery(categoryId, trackId, track);
  const completed = progressRepository.getCompletedLessons(categoryId, trackId);
  const notes = loadPracticeNotes();
  const total = track.lessons.length || 1;
  const doneCount = track.lessons.filter(lesson => completed[lesson.id]).length;
  const practiceCount = track.lessons.filter(lesson => notes[lesson.id] && notes[lesson.id].trim().length > 0).length;
  // challengeCount مبني الآن على أدلة حقيقية: عدد الاختبارات السريعة
  // (quiz) المُجابة بشكل صحيح لدروس هذا المسار تحديدًا، وليس رقمًا
  // ثابتًا مختلقًا. مسارات بلا أي حقل quiz ستُظهر ببساطة 0 بصدق.
  const quizCount = countCorrectQuizzes(track.lessons.map(lesson => lesson.id));
  const assessment = Math.min(100, Math.max(0, Math.round((mastery ? mastery.overallPct : 0) * 0.7 + (practiceCount / total) * 30)));
  const recentPerformance = assessment >= 80 ? t("evidenceStrong") : assessment >= 45 ? t("evidenceDeveloping") : t("evidenceBeginning");
  return {
    doneCount,
    practiceCount,
    challengeCount: quizCount,
    projectCount: 0,
    assessment,
    recentPerformance,
    mastery: mastery || { overallPct: 0 }
  };
}

function renderSkillEvidencePanel(categoryId, trackId, track) {
  const wrap = document.getElementById("evidenceWrap");
  if (!wrap) return;
  const evidence = buildTrackEvidence(categoryId, trackId, track);
  const stats = [
    { label: t("evidenceLessons"), value: `${evidence.doneCount}/${track.lessons.length}` },
    { label: t("evidencePractice"), value: `${evidence.practiceCount}/${track.lessons.length}` },
    { label: t("evidenceChallenges"), value: String(evidence.challengeCount) },
    { label: t("evidenceProjects"), value: String(evidence.projectCount) },
    { label: t("evidenceAssessment"), value: `${evidence.assessment}%` },
    { label: t("evidenceRecent"), value: evidence.recentPerformance }
  ];

  const grid = el("div", { class: "panel-grid" }, stats.map(item =>
    el("div", { class: "panel-card" }, [
      el("span", { class: "panel-label", text: item.label }),
      el("strong", { class: "panel-value", text: item.value })
    ])
  ));

  wrap.replaceChildren(el("div", { class: "evidence-panel" }, [
    el("div", { class: "panel-header" }, [
      el("span", { class: "panel-title", text: t("evidenceTitle") }),
      el("span", { class: "panel-tag", text: t("evidenceLabel") })
    ]),
    grid
  ]));
}

// تقدير وقت التحدي (§10): يعتمد على مستوى الصعوبة الفعلي المحسوب من
// الإتقان الحالي (نفس levelKey المستعمل أصلاً للعرض)، بدل رقم ثابت
// واحد لكل التحديات — تحدٍ للمبتدئين أسرع منطقيًا من تحدٍ للخبراء.
const CHALLENGE_MINUTES_BY_LEVEL = {
  challengeBeginner: 15,
  challengeIntermediate: 25,
  challengeAdvanced: 35,
  challengeExpert: 45
};

function buildAdaptiveChallenge(categoryId, trackId, track) {
  const mastery = computeTrackMastery(categoryId, trackId, track);
  const overall = mastery ? mastery.overallPct : 0;
  const levelKey = overall >= 80 ? "challengeExpert" : overall >= 60 ? "challengeAdvanced" : overall >= 40 ? "challengeIntermediate" : "challengeBeginner";
  const skillTitles = track.lessons.slice(0, Math.min(3, track.lessons.length)).map(lesson => tr(lesson.title));
  const requirements = [
    t("challengeScenario"),
    `${t("projectRequirements")}: ${skillTitles.join(" • ") || tr(track.title)}`,
    `${t("projectConstraints")}: ${track.lessons.length} ${t("evidenceLessons").toLowerCase()}`
  ];

  return {
    level: t(levelKey),
    estimatedMinutes: CHALLENGE_MINUTES_BY_LEVEL[levelKey] || 20,
    objective: t("challengeObjective", { title: tr(track.title), level: t(levelKey) }),
    skills: skillTitles,
    requirements
  };
}

// قائمة التحقق التفاعلية: كل بند من متطلبات التحدي أصبح فعليًا قابلًا
// للتأشير (checkbox حقيقي، محفوظ بـ CHALLENGE_CHECKLIST_KEY)، بدل نص
// وصفي بحت لا يفعل شيئًا. اكتمال كل البنود هو ما يُسجَّل كـ"تحدي منجز".
function renderChallengePanel(categoryId, trackId, track) {
  const wrap = document.getElementById("challengeWrap");
  if (!wrap) return;
  const challenge = buildAdaptiveChallenge(categoryId, trackId, track);
  const checklistState = loadChallengeChecklist();
  const savedItems = (checklistState[trackId] && checklistState[trackId].items) || [];

  const list = el("ul", { class: "panel-list challenge-checklist" });
  challenge.requirements.forEach((item, idx) => {
    const isChecked = !!savedItems[idx];
    const checkbox = el("input", {
      type: "checkbox",
      class: "challenge-checkbox",
      id: `challenge-item-${trackId}-${idx}`,
      onchange: e => {
        const state = loadChallengeChecklist();
        const entry = state[trackId] || { items: [] };
        entry.items[idx] = e.target.checked;
        state[trackId] = entry;
        saveChallengeChecklist(state);
        const solvedNow = isChallengeSolved(trackId);
        if (solvedNow) {
          trackEvent("challenge_completed", { trackId });
          checkNewAchievements(computeProgressSummary(), currentStreak);
        }
        renderChallengePanel(categoryId, trackId, track);
      }
    });
    if (isChecked) checkbox.checked = true;
    const label = el("label", { for: `challenge-item-${trackId}-${idx}`, class: "challenge-checklist-label" }, [checkbox, el("span", { text: item })]);
    list.appendChild(el("li", { class: "challenge-checklist-item" + (isChecked ? " done" : "") }, [label]));
  });

  const solved = isChallengeSolved(trackId);
  const grid = el("div", { class: "panel-grid" }, [
    el("div", { class: "panel-card" }, [
      el("span", { class: "panel-label", text: t("challengeDifficulty") }),
      el("strong", { class: "panel-value", text: challenge.level })
    ]),
    el("div", { class: "panel-card" }, [
      el("span", { class: "panel-label", text: t("challengeSkills") }),
      el("strong", { class: "panel-value", text: challenge.skills.join(" • ") || tr(track.title) })
    ]),
    el("div", { class: "panel-card" }, [
      el("span", { class: "panel-label", text: t("challengeEstimatedTime") }),
      el("strong", { class: "panel-value", text: t("minutesShort", { minutes: challenge.estimatedMinutes }) })
    ])
  ]);

  wrap.replaceChildren(el("div", { class: "challenge-panel" }, [
    el("div", { class: "panel-header" }, [
      el("span", { class: "panel-title", text: t("challengeTitle") }),
      el("span", { class: "panel-tag" + (solved ? " panel-tag-solved" : ""), text: solved ? t("challengeSolved") : t("proofLabel") })
    ]),
    el("p", { class: "panel-lead", text: challenge.objective }),
    grid,
    list
  ]));
}

// ملاحظة أمانة بيانات: لا يوجد نظام تسليم أو تصحيح مشاريع فعلي في هذا
// التطبيق (بلا خادم). لذلك لا نخترع درجات دقيقة لكل معيار (Requirements
// 92%، Quality 81%...) كأنها تقييم موضوعي — هذا كان يحدث سابقًا عبر
// معادلة اعتباطية (knowledgePct + 10 مثلاً) بلا أي أساس حقيقي. بدل ذلك
// نعرض المكونات الحقيقية الوحيدة المتوفرة فعلاً (المعرفة والتطبيق
// العملي المحسوبين من computeTrackMastery) مع تسمية واضحة كـ"تقدير
// ذاتي" وليس تقييمًا مصححًا.
// أدلة وموارد المشروع (§11): كانت لوحة المشروع تعرض متطلبات نظرية بلا
// أي مساعدة فعلية عند التعثر. الآن نستخرج تلميحات حقيقية من نفس دروس
// المسار (حقل lesson.tip، الموجود أصلاً فـ data.js لكل درس) بدل اختلاق
// نصائح عامة، ونجمع كل روابط lesson.resources الحقيقية فـ مكان واحد.
// مسار بلا أي resources ببساطة لن يُظهر قسم الموارد — بصدق، بلا روابط
// وهمية. الأهداف الإضافية (stretch goals) مبنية على نفس بيانات المسار:
// اقتراح تطبيق الدرس الأخير (الأكثر تقدمًا) كإضافة اختيارية للمشروع.
function buildProjectHints(track) {
  return track.lessons
    .map(lesson => lesson.tip ? tr(lesson.tip) : null)
    .filter(Boolean)
    .slice(0, 3);
}

function buildProjectResources(track) {
  const seen = new Set();
  const resources = [];
  track.lessons.forEach(lesson => {
    (lesson.resources || []).forEach(resource => {
      if (seen.has(resource.url)) return;
      seen.add(resource.url);
      resources.push(resource);
    });
  });
  return resources;
}

function buildProjectStretchGoals(track) {
  const lastLesson = track.lessons[track.lessons.length - 1];
  if (!lastLesson) return [];
  return [t("projectStretchGoal", { title: tr(lastLesson.title) })];
}

function buildProjectModel(categoryId, trackId, track) {
  const mastery = computeTrackMastery(categoryId, trackId, track) || { knowledgePct: 0, practicePct: 0, overallPct: 0 };
  const rubric = [
    { label: t("masteryKnowledgeLabel"), value: mastery.knowledgePct },
    { label: t("masteryPracticeLabel"), value: mastery.practicePct }
  ];
  const overall = mastery.overallPct;
  return {
    objective: `${t("projectObjective")}: ${tr(track.title)}`,
    context: `${t("projectContext")}: ${tr(track.summary)}`,
    requirements: [
      {
        id: "project-lessons",
        text: `${t("projectRequirements")}: ${track.lessons.slice(0, 3).map(lesson => tr(lesson.title)).join(" • ") || tr(track.title)}`
      },
      {
        id: "project-constraints",
        text: `${t("projectConstraints")}: ${t("challengeScenario")}`
      }
    ],
    hints: buildProjectHints(track),
    resources: buildProjectResources(track),
    stretchGoals: buildProjectStretchGoals(track),
    rubric,
    overall
  };
}

function renderProjectPanel(categoryId, trackId, track) {
  const wrap = document.getElementById("projectWrap");
  if (!wrap) return;
  const project = buildProjectModel(categoryId, trackId, track);
  const list = el("ul", { class: "panel-list" }, project.requirements.map(item => el("li", { text: item.text })));
  const rubric = el("div", { class: "project-matrix" }, project.rubric.map(row =>
    el("div", { class: "project-score" }, [
      el("span", { class: "project-score-label", text: row.label }),
      el("span", { class: "project-score-value", text: `${Math.round(row.value)}%` })
    ])
  ));

  // قسم التلميحات (§11): مخفي افتراضيًا خلف زر "أظهر تلميحًا" بدل عرضه
  // مباشرة — يبقى الحل بيد المستخدم، والتلميح مجرد دعم عند التعثر
  // الفعلي، اتساقًا مع بنية Hint → Explanation المعتمدة فـ Masar Mentor.
  let hintsBox = null;
  if (project.hints.length) {
    const hintsList = el("ul", { class: "panel-list hidden" }, project.hints.map(item => el("li", { text: item })));
    const revealBtn = el("button", {
      type: "button",
      class: "btn-back",
      text: t("projectShowHints"),
      onclick: () => {
        hintsList.classList.toggle("hidden");
        revealBtn.textContent = hintsList.classList.contains("hidden") ? t("projectShowHints") : t("projectHideHints");
      }
    });
    hintsBox = el("div", { class: "project-hints" }, [revealBtn, hintsList]);
  }

  const resourcesBox = project.resources.length
    ? el("div", { class: "lesson-resources" }, project.resources.map(resource => el("a", {
        class: "resource-link",
        href: resource.url,
        target: "_blank",
        rel: "noopener noreferrer"
      }, [el("span", { "aria-hidden": "true", class: "resource-icon", text: "↗" }), resource.label])))
    : null;

  const stretchBox = project.stretchGoals.length
    ? el("div", { class: "project-stretch" }, [
        el("span", { class: "panel-label", text: t("projectStretchGoals") }),
        el("ul", { class: "panel-list" }, project.stretchGoals.map(item => el("li", { text: item })))
      ])
    : null;

  wrap.replaceChildren(el("div", { class: "project-panel" }, [
    el("div", { class: "panel-header" }, [
      el("span", { class: "panel-title", text: t("projectTitle") }),
      el("span", { class: "panel-tag", text: `~${Math.round(project.overall)}%` })
    ]),
    el("p", { class: "panel-lead", text: project.objective }),
    el("p", { class: "panel-copy", text: project.context }),
    list,
    hintsBox,
    resourcesBox,
    stretchBox,
    el("div", { class: "project-evaluation" }, [
      el("span", { class: "project-evaluation-label", text: t("projectEvaluation") }),
      rubric
    ]),
    el("p", { class: "mastery-hint", text: t("projectEvaluationDisclaimer") }),
    typeof window.masarOpenProjectWorkspace === "function"
      ? el("button", {
          type: "button",
          class: "btn-primary btn-workspace",
          text: t("projectOpenWorkspace"),
          onclick: () => window.masarOpenProjectWorkspace(categoryId, trackId, track)
        })
      : null
  ].filter(Boolean)));
}

function renderLessonList(categoryId, trackId) {
  const result = findTrack(categoryId, trackId);
  if (!result || !result.track) return;
  const { track } = result;

  const list = document.getElementById("lessonList");
  list.replaceChildren();

  const completed = progressRepository.getCompletedLessons(categoryId, trackId);
  const done = countDone(categoryId, trackId, track.lessons);
  const pct = progressPercent(done, track.lessons.length);

  const progressBar = document.getElementById("trackProgressBar");
  document.getElementById("trackProgressFill").style.width = pct + "%";
  const progressText = t("progressText", { done, total: track.lessons.length, pct });
  progressBar.setAttribute("aria-valuenow", String(pct));
  progressBar.setAttribute("aria-valuetext", progressText);
  document.getElementById("trackProgressText").textContent = progressText;

  renderMasteryPanel(categoryId, trackId, track);
  renderSkillMap(categoryId, trackId, track);
  renderLearningPathInsight(categoryId, trackId, track);
  renderChallengePanel(categoryId, trackId, track);
  renderProjectPanel(categoryId, trackId, track);
  renderSkillEvidencePanel(categoryId, trackId, track);
  renderAssessmentPanel(categoryId, trackId, track);

  const certWrap = document.getElementById("certificateWrap");
  if (certWrap) {
    certWrap.replaceChildren();
    if (track.lessons.length > 0 && done === track.lessons.length) {
      const assessmentResult = track.assessment ? getAssessmentResult(trackId) : null;
      const assessmentStatusLabel = assessmentResult
        ? (assessmentResult.passed ? t("assessmentPassed") : t("assessmentFailed"))
        : null;
      const assessmentLine = assessmentResult
        ? t("certificateAssessmentScoreLine", { pct: assessmentResult.pct, status: assessmentStatusLabel })
        : null;

      // §13: أدلة حقيقية كاملة (دروس/تطبيق/تحديات/مشاريع/إتقان)، بلا أي
      // رقم مختلق — نفس الدوال الموجودة أصلاً (buildTrackEvidence) التي
      // تغذي لوحة "أدلة المهارة" فـ صفحة المسار، مُعاد استعمالها هنا.
      const certEvidence = buildTrackEvidence(categoryId, trackId, track);
      const evidenceLine = t("certificateEvidenceLine", {
        lessons: certEvidence.doneCount,
        total: track.lessons.length,
        practice: certEvidence.practiceCount,
        challenges: certEvidence.challengeCount,
        projects: certEvidence.projectCount,
        mastery: certEvidence.mastery.overallPct
      });

      certWrap.appendChild(el("button", {
        type: "button",
        class: "btn-primary btn-certificate",
        text: t("downloadCertificate"),
        onclick: () => downloadCertificate(tr(track.title), assessmentLine, evidenceLine)
      }));
      certWrap.appendChild(el("button", {
        type: "button",
        class: "btn-linkedin-share",
        text: t("shareLinkedin"),
        onclick: () => {
          const shareText = `${t("appName")}: ${tr(track.title)}`;
          const shareUrl = window.location.href.split("#")[0] + `#track-${categoryId}-${trackId}`;
          const linkedinUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(shareUrl)
            + "&title=" + encodeURIComponent(shareText);
          window.open(linkedinUrl, "_blank", "noopener,noreferrer");
        }
      }));

      // تلميح غير حاجب: إن كان لهذا المسار اختبار نهائي ولم يُجتَز بعد،
      // نشجّع المستخدم على إنجازه ليصبح دليل الشهادة أقوى — بدون منعه من
      // تحميل الشهادة الآن، لأنها أصلاً مبنية على إكمال كل الدروس فعليًا.
      if (track.assessment && (!assessmentResult || !assessmentResult.passed)) {
        certWrap.appendChild(el("p", { class: "mastery-hint certificate-assessment-nudge", text: t("assessmentNudgeForCertificate") }));
      }
    }
  }

  track.lessons.forEach((lesson, idx) => {
    const isDone = !!completed[lesson.id];
    list.appendChild(buildLessonItem(categoryId, trackId, lesson, idx, isDone));
  });

  if (window.hljs) {
    list.querySelectorAll("pre.lesson-code code").forEach(block => hljs.highlightElement(block));
  }
}

// ===================================================================
// التنقل: العودة إلى الرف
// إصلاح: كان الكود القديم يستخدم pushState عند "العودة"، مما يضيف
// حالة Dashboard جديدة فوق حالة المسار بدل الرجوع إليها، فيكسر زر
// الرجوع في المتصفح. الآن نستخدم history.back() عندما نعرف أننا نحن
// من دفعنا حالة المسار في هذه الجلسة، وreplaceState فقط كحل بديل آمن
// (بدون إضافة حالة جديدة) حين لا نملك تلك المعرفة (مثلاً: دخول مباشر
// عبر رابط بهاش المسار).
// ===================================================================
function showDashboardView() {
  currentTrackRef = null;
  document.getElementById("trackView").classList.add("hidden");
  document.getElementById("dashboardView").classList.remove("hidden");
  renderAll();
}

function goBackToShelf() {
  if (hasPushedTrackState && history.state && history.state.view === "track") {
    history.back();
  } else {
    history.replaceState({ view: "dashboard" }, "", window.location.pathname);
    showDashboardView();
  }
}

document.getElementById("backToShelf").onclick = goBackToShelf;
document.getElementById("notFoundBrowseBtn").onclick = goBackToShelf;

document.getElementById("resetProgress").onclick = () => {
  if (!currentTrackRef || !confirm(t("resetConfirm"))) return;
  const ok = progressRepository.resetTrack(currentTrackRef.categoryId, currentTrackRef.trackId);
  if (ok) {
    const summary = computeProgressSummary();
    renderRecommended(summary);
    renderShelves(summary);
    renderDashboard(summary);
    renderLessonList(currentTrackRef.categoryId, currentTrackRef.trackId);
  } else {
    showToast(t("resetError"));
  }
};

window.addEventListener("popstate", event => {
  const state = event.state;
  if (state && state.view === "track") {
    openTrack(state.categoryId, state.trackId, false);
    return;
  }
  showDashboardView();
});

window.addEventListener("storage", event => {
  if (event.key === PROGRESS_KEY || event.key === STREAK_KEY) {
    progressRepository.reload();
    currentStreak = loadStreak();
    renderAll();
    if (currentTrackRef) {
      renderLessonList(currentTrackRef.categoryId, currentTrackRef.trackId);
    }
  }
});

window.addEventListener("online", () => updateConnectionStatus());
window.addEventListener("offline", () => updateConnectionStatus());

// ===================================================================
// تصدير / استيراد التقدم — نسخة احتياطية بدون الحاجة إلى حساب أو خادم
// ===================================================================
function handleExportProgress() {
  const json = progressRepository.exportData();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = el("a", { href: url, download: `masar-progress-${getLocalDateKey()}.json` });
  try { localStorage.setItem(DATA_BACKUP_KEY, new Date().toISOString()); } catch (e) {}
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function handleResetAllData() {
  if (!confirm(t("resetAllConfirm"))) return;
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(LEGACY_PROGRESS_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(PRACTICE_KEY);
    localStorage.removeItem(RETENTION_KEY);
    localStorage.removeItem(HELPFUL_LOCAL_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
    localStorage.removeItem(ASSESSMENT_KEY);
  } catch (e) {
    showToast(t("resetError"));
    return;
  }

  progressRepository.resetAll();
  userPrefs = { goal: null, level: null, onboarded: false };
  currentStreak = { count: 0, lastDate: null };
  savePrefs(userPrefs);
  renderAll();
  if (document.getElementById("onboardingOverlay")) openOnboarding();
  showToast(t("resetAllDone"));
}

async function handleShareProgress() {
  const summary = computeProgressSummary();
  const totalLessons = SKILL_DATA.reduce((sum, category) => sum + category.tracks.reduce((trackSum, track) => trackSum + track.lessons.length, 0), 0);
  const shareText = `${t("appName")}: ${t("shareProgressText", {
    done: summary.totalDone,
    total: totalLessons,
    percent: totalLessons === 0 ? 0 : Math.round((summary.totalDone / totalLessons) * 100)
  })}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: t("appName"),
        text: shareText,
        url: window.location.href.split("#")[0]
      });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareText);
      showToast(t("shareCopied"));
      return;
    }
    showToast(t("shareFallback"));
  } catch (e) {
    showToast(t("shareFallback"));
  }
}

function handleImportFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      progressRepository.importData(reader.result);
      renderAll();
      if (currentTrackRef) renderLessonList(currentTrackRef.categoryId, currentTrackRef.trackId);
      showToast(t("importSuccess"));
    } catch (e) {
      showToast(t("importError"));
    }
  };
  reader.onerror = () => showToast(t("importError"));
  reader.readAsText(file);
}

document.getElementById("exportBtn").onclick = handleExportProgress;
document.getElementById("importBtn").onclick = () => document.getElementById("importFileInput").click();
document.getElementById("resetAllBtn").onclick = handleResetAllData;
document.getElementById("shareBtn").onclick = handleShareProgress;
document.addEventListener("keydown", event => {
  const activeTag = document.activeElement && document.activeElement.tagName;
  const metaPressed = event.ctrlKey || event.metaKey;
  if (metaPressed && event.key.toLowerCase() === "k") {
    event.preventDefault();
    const search = document.getElementById("searchInput");
    if (search) search.focus();
  }
  if (event.key === "Escape") {
    const auth = document.getElementById("authModalOverlay");
    const onboarding = document.getElementById("onboardingOverlay");
    if (auth && !auth.classList.contains("hidden")) auth.classList.add("hidden");
    if (onboarding && !onboarding.classList.contains("hidden")) onboarding.classList.add("hidden");
  }
  if (metaPressed && activeTag !== "TEXTAREA" && activeTag !== "INPUT" && event.key === "/") {
    event.preventDefault();
    const search = document.getElementById("searchInput");
    if (search) search.focus();
  }
});
let deferredInstallPrompt = null;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installBtn) installBtn.classList.remove("hidden");
});

if (installBtn) {
  installBtn.onclick = async () => {
    if (!deferredInstallPrompt) {
      showToast(t("installUnavailable"));
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installBtn.classList.add("hidden");
  };
}

document.getElementById("importFileInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (file) handleImportFile(file);
  event.target.value = "";
});

// ===================================================================
// إعادة الرسم الشامل
// ===================================================================
function renderAll() {
  const summary = computeProgressSummary();
  renderShelfNav();
  renderRecommended(summary);
  renderShelves(summary);
  renderDashboard(summary);
}

// فحص سلامة مخطط المهارات مرة واحدة عند الإقلاع. لا يظهر أي شيء
// للمستخدم ولا يوقف التطبيق أبدًا؛ الهدف حماية المطوّرين من خطأ في
// معرّف متطلب سابق أو حلقة دائرية قد تفوتهم أثناء تحرير data.js.
validateSkillGraph();
validateLessonGraph();

applySavedTheme();
applyLanguageUI();
updateConnectionStatus();
document.getElementById("themeToggle").onclick = toggleTheme;
document.getElementById("langSwitcher").onchange = event => setLanguage(event.target.value);

const debouncedSearch = debounce(value => {
  searchQuery = value.toLowerCase().trim();
  renderShelves(computeProgressSummary());
}, 150);
document.getElementById("searchInput").addEventListener("input", event => {
  debouncedSearch(event.target.value);
});

let initialTrackRef = null;
const trackHashPrefix = "#track-";
// إصلاح: "-" وحده كفاصل هش لأن categoryId نفسه يمكن أن يحتوي على "-"
// (مثال: "professional-growth"). الآن نبحث عن معرّف فئة حقيقي من SKILL_DATA
// كبادئة (prefix) بدل افتراض أول "-" فقط، فتفادينا قطع categoryId ناقص.
function parseTrackHash(hashValue) {
  const knownCategoryIds = SKILL_DATA.map(cat => cat.id);
  // نرتب من الأطول للأقصر لتفادي تطابق جزئي خاطئ (مثال: "life" داخل "life-skills").
  knownCategoryIds.sort((a, b) => b.length - a.length);
  for (const categoryId of knownCategoryIds) {
    if (hashValue === categoryId) continue; // لازم يبقى شيء بعد الفئة كـ trackId
    if (hashValue.startsWith(categoryId + "-")) {
      const trackId = hashValue.slice(categoryId.length + 1);
      if (trackId) return { categoryId, trackId };
    }
  }
  // fallback: فئة غير معروفة (رابط قديم/تالف) — نرجع لأول "-" كأفضل تخمين
  // ممكن، بدل ما نرفض الرابط بالكامل. openTrack سيعرض "غير موجود" إذا لزم.
  const fallbackIndex = hashValue.indexOf("-");
  if (fallbackIndex > 0) {
    return { categoryId: hashValue.slice(0, fallbackIndex), trackId: hashValue.slice(fallbackIndex + 1) };
  }
  return null;
}
if (window.location.hash.startsWith(trackHashPrefix)) {
  const hashValue = window.location.hash.slice(trackHashPrefix.length);
  const parsed = parseTrackHash(hashValue);
  if (parsed) {
    initialTrackRef = parsed; // نسمح بها حتى لو غير موجودة؛ openTrack سيعرض شاشة "غير موجود"
  }
} else {
  try {
    const savedView = JSON.parse(localStorage.getItem(LAST_VIEW_KEY));
    if (savedView && savedView.categoryId && savedView.trackId) {
      initialTrackRef = { categoryId: savedView.categoryId, trackId: savedView.trackId };
    }
  } catch (e) {
    // لا تعطل التطبيق إذا كانت بيانات الأخيرة تالفة.
  }
}

if (!history.state) {
  history.replaceState(
    initialTrackRef
      ? { view: "track", ...initialTrackRef }
      : { view: "dashboard" },
    "",
    window.location.href
  );
}

if (initialTrackRef) {
  openTrack(initialTrackRef.categoryId, initialTrackRef.trackId, false);
  // إصلاح: openTrack لا يستدعي renderDashboard، وبالتالي لا يملأ شارة
  // المستوى/XP fi الهيدر (levelBadge) الظاهرة فـ كل الصفحات. بدون هذا،
  // أي إقلاع مباشر لصفحة مسار (عبر hash أو آخر صفحة محفوظة) كان يترك
  // الشارة فارغة حتى يرجع المستخدم للوحة الرئيسية.
  renderLevelBadge(computeProgressSummary());
} else {
  renderAll();
}

if (!userPrefs.onboarded) {
  openOnboarding();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").then(registration => {
    // ترقيم الكاش (CORE_CACHE_NAME/RUNTIME_CACHE_NAME) يبقى يدويًا عمدًا:
    // بدون خطوة build حقيقية (الملف vanilla بلا bundler) ما كاينش وسيلة
    // موثوقة لتوليد hash تلقائي لمحتوى الملفات. اللي كنقدرو نديرو، وهو
    // التخفيف الحقيقي لمشكلة "بقاء نسخة قديمة عالقة"، هو نفحصو على نسخة
    // جديدة كل مرة كايرجع المستخدم للتطبيق (تبويب نشط)، بدل الاعتماد فقط
    // على الفحص التلقائي النادر للمتصفح.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") registration.update();
    });
  }).catch(() => {
    // دعم Offline اختياري ويجب ألا يوقف عمل التطبيق.
  });
}