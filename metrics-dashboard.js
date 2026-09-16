// ===================================================================
// لوحة مقاييس المنتج (Product Metrics Dashboard)
// ===================================================================
// كانت هذه اللوحة غائبة كليًا: البيانات الخام (ANALYTICS_KEY، الستريك،
// progressRepository...) كانت موجودة أصلاً، لكن لا توجد أي واجهة تحسبها
// أو تعرضها كمقاييس منتج حقيقية (Learning / Engagement / Outcome).
//
// مبدأ مهم: هذا الملف لا يجمع أي بيانات جديدة ولا يرسلها لأي خادم. كل
// رقم هنا مُشتق محليًا من:
//   - ANALYTICS_KEY (سجل أحداث محلي محدود الحجم، معرّف أصلاً فـ app.js)
//   - progressRepository (تقدم الدروس)
//   - loadRetentionState / getDueReviews (التكرار المتباعد)
//   - loadUnlockedAchievements (الشارات)
//   - loadProjectSubmissions (المشاريع، عبر project-workspace.js)
//
// بصدق: بما أن هذا مستخدم واحد على جهاز واحد (بلا خادم مركزي)، فمقاييس
// مثل "Weekly Active Learners" هنا تعني حرفيًا "كم يومًا كنت نشطًا هذا
// الأسبوع"، وليس عدد مستخدمين حقيقيين. هذا موضّح صراحة فـ الواجهة بدل
// الادعاء بمقياس متعدد المستخدمين لا وجود لبنيته التحتية أصلاً.
// ===================================================================

function loadAnalyticsEvents() {
  try {
    const raw = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function countEventsByName(events, name) {
  return events.filter(e => e && e.name === name).length;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ---------- Learning metrics ----------
function computeLearningMetrics(summary) {
  const events = loadAnalyticsEvents();
  const lessonsStarted = countEventsByName(events, "track_opened");
  const lessonsCompleted = countEventsByName(events, "lesson_completed");
  const exercisesCorrect = (typeof window.masarCountCorrectExercises === "function")
    ? window.masarCountCorrectExercises()
    : 0;
  const quizzesCorrect = (typeof countCorrectQuizzes === "function") ? countCorrectQuizzes() : 0;
  const dueReviews = (typeof getDueReviews === "function") ? getDueReviews(9999).length : 0;
  const projectsCompleted = countEventsByName(events, "project_completed");
  const challengesCompleted = countEventsByName(events, "challenge_completed");

  // معدل إنجاز تقريبي: من كل درس فُتح، كم انتهى بالفعل بوضعه "منجز".
  const completionRate = lessonsStarted > 0
    ? Math.round((lessonsCompleted / lessonsStarted) * 100)
    : 0;

  return {
    lessonsStarted, lessonsCompleted, completionRate,
    exercisesCorrect, quizzesCorrect, dueReviews,
    projectsCompleted, challengesCompleted,
    totalDone: summary.totalDone, booksFinished: summary.booksFinished
  };
}

// ---------- Engagement metrics ----------
function computeEngagementMetrics() {
  const events = loadAnalyticsEvents();
  const now = Date.now();
  const sevenDaysAgo = daysAgo(7).getTime();
  const thirtyDaysAgo = daysAgo(30).getTime();

  const eventsLast7 = events.filter(e => e.at >= sevenDaysAgo);
  const eventsLast30 = events.filter(e => e.at >= thirtyDaysAgo);

  const activeDaysLast7 = new Set(eventsLast7.map(e => getLocalDateKey(new Date(e.at)))).size;
  const activeDaysLast30 = new Set(eventsLast30.map(e => getLocalDateKey(new Date(e.at)))).size;

  const streak = (typeof currentStreak !== "undefined") ? currentStreak : { count: 0, lastDate: null };
  const today = getLocalDateKey();
  const streakHealthy = streak.lastDate === today || streak.lastDate === addDays(today, -1);

  return {
    activeDaysLast7, activeDaysLast30,
    totalSessionsRecorded: events.length,
    streakCount: streak.count,
    streakHealthy
  };
}

// ---------- Outcome metrics ----------
function computeOutcomeMetrics(summary) {
  let skillsMastered = 0;
  let totalTracksStarted = 0;
  SKILL_DATA.forEach(cat => {
    cat.tracks.forEach(track => {
      const info = summary.perTrack.get(`${cat.id}::${track.id}`);
      if (!info || info.done === 0) return;
      totalTracksStarted++;
      const mastery = (typeof computeTrackMastery === "function")
        ? computeTrackMastery(cat.id, track.id, track)
        : null;
      if (mastery && mastery.state === "mastered") skillsMastered++;
    });
  });

  const pathsCompleted = (typeof LEARNING_PATHS !== "undefined")
    ? LEARNING_PATHS.filter(path => {
        const progress = (typeof computeLearningPathProgress === "function")
          ? computeLearningPathProgress(path)
          : null;
        return progress && progress.finished;
      }).length
    : 0;

  const achievements = (typeof loadUnlockedAchievements === "function") ? loadUnlockedAchievements() : {};
  const achievementsUnlocked = Object.keys(achievements).length;

  return {
    skillsMastered, totalTracksStarted, pathsCompleted,
    booksFinished: summary.booksFinished, achievementsUnlocked
  };
}

function buildMetricCard(label, value, note) {
  return el("div", { class: "metrics-card" }, [
    el("span", { class: "metrics-card-label", text: label }),
    el("strong", { class: "metrics-card-value", text: String(value) }),
    note ? el("span", { class: "metrics-card-note", text: note }) : null
  ].filter(Boolean));
}

function renderMetricsSection(title, cards) {
  return el("div", { class: "metrics-section" }, [
    el("h3", { class: "metrics-section-title", text: title }),
    el("div", { class: "metrics-grid" }, cards)
  ]);
}

function renderMetricsDashboard() {
  const body = document.getElementById("metricsDashboardBody");
  const titleEl = document.getElementById("metricsDashboardTitle");
  if (!body) return;
  if (titleEl) titleEl.textContent = t("metricsDashboardTitle");

  const summary = computeProgressSummary();
  const learning = computeLearningMetrics(summary);
  const engagement = computeEngagementMetrics();
  const outcome = computeOutcomeMetrics(summary);

  body.replaceChildren(
    el("p", { class: "mastery-hint metrics-disclaimer", text: t("metricsDisclaimer") }),

    renderMetricsSection(t("metricsLearningTitle"), [
      buildMetricCard(t("metricsLessonsCompleted"), learning.lessonsCompleted),
      buildMetricCard(t("metricsCompletionRate"), learning.completionRate + "%"),
      buildMetricCard(t("metricsExercisesCorrect"), learning.exercisesCorrect + learning.quizzesCorrect),
      buildMetricCard(t("metricsDueReviews"), learning.dueReviews),
      buildMetricCard(t("metricsProjectsCompleted"), learning.projectsCompleted),
      buildMetricCard(t("metricsChallengesCompleted"), learning.challengesCompleted)
    ]),

    renderMetricsSection(t("metricsEngagementTitle"), [
      buildMetricCard(t("metricsActiveDays7"), engagement.activeDaysLast7 + "/7"),
      buildMetricCard(t("metricsActiveDays30"), engagement.activeDaysLast30 + "/30"),
      buildMetricCard(t("metricsStreak"), engagement.streakCount, engagement.streakHealthy ? t("metricsStreakHealthy") : t("metricsStreakAtRisk"))
    ]),

    renderMetricsSection(t("metricsOutcomeTitle"), [
      buildMetricCard(t("metricsSkillsMastered"), outcome.skillsMastered, `${t("metricsOf")} ${outcome.totalTracksStarted} ${t("metricsStarted")}`),
      buildMetricCard(t("metricsPathsCompleted"), outcome.pathsCompleted),
      buildMetricCard(t("metricsBooksFinished"), outcome.booksFinished),
      buildMetricCard(t("metricsAchievements"), outcome.achievementsUnlocked)
    ])
  );
}

function openMetricsDashboard() {
  renderMetricsDashboard();
  document.getElementById("metricsDashboardOverlay").classList.remove("hidden");
}
function closeMetricsDashboard() {
  document.getElementById("metricsDashboardOverlay").classList.add("hidden");
}

// فحص دفاعي: لو غاب أحد العناصر (مثلاً إن لم يُحدَّث index.html)، لا نكسر
// باقي التطبيق — فقط لا نُفعّل الزر.
const metricsBtn = document.getElementById("metricsDashboardBtn");
if (metricsBtn) metricsBtn.addEventListener("click", openMetricsDashboard);
const metricsCloseBtn = document.getElementById("metricsDashboardCloseBtn");
if (metricsCloseBtn) metricsCloseBtn.addEventListener("click", closeMetricsDashboard);
const metricsOverlay = document.getElementById("metricsDashboardOverlay");
if (metricsOverlay) {
  metricsOverlay.addEventListener("click", e => {
    if (e.target.id === "metricsDashboardOverlay") closeMetricsDashboard();
  });
}
