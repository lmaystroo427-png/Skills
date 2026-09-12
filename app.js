// ===================================================================
// ثوابت وإعدادات عامة
// ===================================================================
const PROGRESS_KEY = "masar_progress_v2";       // مخطط جديد: يعتمد على lesson.id وليس رقم الترتيب
const LEGACY_PROGRESS_KEY = "masar_progress_v1"; // المخطط القديم، يُقرأ مرة واحدة فقط للترحيل
const PROGRESS_SCHEMA_VERSION = 2;
const STREAK_KEY = "masar_streak_v1";
// تنبيه: THEME_KEY و LANG_KEY و SUPPORTED_LANGS مكرّرة حرفيًا في السكربت
// المضمّن أعلى index.html (يُنفَّذ قبل تحميل هذا الملف لتفادي "flash" بصري
// للغة/الثيم الافتراضيين). أي تعديل هنا يجب أن يُرافقه تعديل مطابق هناك.
const THEME_KEY = "masar_theme_v1";
const LANG_KEY = "masar_lang_v1";
const SUPPORTED_LANGS = ["en", "ar", "ary", "fr", "es", "pt", "it", "de"];

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
  return obj[currentLang] || obj.en;
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

function isValidProgressState(obj) {
  return !!obj && typeof obj === "object"
    && obj.version === PROGRESS_SCHEMA_VERSION
    && obj.tracks && typeof obj.tracks === "object";
}

// يحوّل المخطط القديم (index-based) إلى الجديد (id-based) بأفضل ما يمكن،
// بافتراض أن ترتيب الدروس وقت هذا الترحيل مطابق للترتيب الذي أنجز به
// المستخدم دروسه سابقًا (وهو افتراض معقول لأنه أول ترحيل من هذا النوع).
function migrateLegacyProgress(legacyParsed) {
  const migrated = defaultProgressState();
  if (!legacyParsed || typeof legacyParsed !== "object") return migrated;

  Object.keys(legacyParsed).forEach(compositeKey => {
    const sepIndex = compositeKey.indexOf("::");
    if (sepIndex === -1) return;
    const categoryId = compositeKey.slice(0, sepIndex);
    const trackId = compositeKey.slice(sepIndex + 2);
    const result = findTrack(categoryId, trackId);
    if (!result || !result.track) return;

    const legacyEntry = legacyParsed[compositeKey] || {};
    const completedLessons = {};
    result.track.lessons.forEach((lesson, idx) => {
      if (legacyEntry[idx]) completedLessons[lesson.id] = true;
    });
    migrated.tracks[compositeKey] = { completedLessons, updatedAt: Date.now() };
  });

  return migrated;
}

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

  exportData() {
    return JSON.stringify({ ...this.state, exportedAt: new Date().toISOString() }, null, 2);
  },

  // مُحصَّنة: تتحقق من شكل كل إدخال قبل قبوله، وترفض المفاتيح الخطرة
  // (__proto__ / constructor / prototype) لمنع أي احتمال لتلوّث الـ
  // prototype عبر ملف مستورد.
  importData(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!isValidProgressState(parsed)) throw new Error("Invalid Masar progress file");
    const tracks = {};
    Object.keys(parsed.tracks).forEach(trackKey => {
      if (trackKey === "__proto__" || trackKey === "constructor" || trackKey === "prototype") return;
      const entry = parsed.tracks[trackKey];
      if (!entry || typeof entry !== "object" || Array.isArray(entry)
        || !entry.completedLessons || typeof entry.completedLessons !== "object"
        || Array.isArray(entry.completedLessons)) return;
      tracks[trackKey] = {
        ...entry,
        completedLessons: { ...entry.completedLessons }
      };
    });
    this.state = { version: parsed.version, tracks };
    persistProgressState(this.state);
  }
};

// ===================================================================
// الستريك — يُحسب الآن على أساس تاريخ التقويم المحلي (YYYY-MM-DD)
// بدل طرح 86400000 ملي ثانية، الذي يمكن أن يخطئ حول منتصف الليل أو
// عند تغييرات التوقيت الصيفي.
// ===================================================================
function getLocalDateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function addDays(dateKey, delta) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return getLocalDateKey(dt);
}

// يطبّع بيانات الستريك القديمة (كانت مخزنة بصيغة toDateString مثل
// "Mon Jan 01 2024") إلى صيغة YYYY-MM-DD الجديدة عند أول قراءة.
function normalizeStreak(raw) {
  if (!raw || typeof raw !== "object") return { count: 0, lastDate: null };
  let lastDate = raw.lastDate;
  if (lastDate && !/^\d{4}-\d{2}-\d{2}$/.test(lastDate)) {
    const parsed = new Date(lastDate);
    lastDate = Number.isNaN(parsed.getTime()) ? null : getLocalDateKey(parsed);
  }
  return { count: Number(raw.count) || 0, lastDate: lastDate || null };
}

function loadStreak() {
  try {
    return normalizeStreak(JSON.parse(localStorage.getItem(STREAK_KEY)));
  } catch (e) {
    return { count: 0, lastDate: null };
  }
}

function bumpStreak() {
  const streak = loadStreak();
  const today = getLocalDateKey();
  if (streak.lastDate === today) return streak; // مُحتسب اليوم بالفعل
  const yesterday = addDays(today, -1);
  streak.count = streak.lastDate === yesterday ? streak.count + 1 : 1;
  streak.lastDate = today;
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch (e) {
    showToast(t("saveError"));
  }
  currentStreak = streak;
  return streak;
}

// ===================================================================
// نظام الشارات (Achievements) — مبني فوق progressRepository والستريك
// الموجودين مسبقًا، بلا حاجة لأي خادم. يُخزَّن فقط تاريخ أول فتح لكل
// شارة، لعرض toast مرة واحدة فقط عند تحقيقها.
// ===================================================================
const ACHIEVEMENTS_KEY = "masar_achievements_v1";

const ACHIEVEMENTS = [
  { id: "first_lesson", icon: "🌱", check: s => s.totalDone >= 1 },
  { id: "ten_lessons", icon: "📖", check: s => s.totalDone >= 10 },
  { id: "fifty_lessons", icon: "📚", check: s => s.totalDone >= 50 },
  { id: "first_book", icon: "🏆", check: s => s.booksFinished >= 1 },
  { id: "three_books", icon: "🎓", check: s => s.booksFinished >= 3 },
  { id: "streak_3", icon: "🔥", check: (s, streak) => streak.count >= 3 },
  { id: "streak_7", icon: "⚡", check: (s, streak) => streak.count >= 7 },
  { id: "streak_30", icon: "🌟", check: (s, streak) => streak.count >= 30 }
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

// يتحقق من الشارات الجديدة مقارنة بالحالة الحالية، يخزنها، ويعرض toast
// لكل شارة تُفتح للمرة الأولى (بدون إزعاج المستخدم بشارات محقّقة سابقًا).
function checkNewAchievements(summary, streak) {
  const unlocked = loadUnlockedAchievements();
  let changed = false;
  ACHIEVEMENTS.forEach(a => {
    if (!unlocked[a.id] && a.check(summary, streak)) {
      unlocked[a.id] = Date.now();
      changed = true;
      showToast(`${a.icon} ${t("achievementUnlocked", { name: t("achv_" + a.id + "_title") })}`);
    }
  });
  if (changed) persistUnlockedAchievements(unlocked);
  return unlocked;
}

function renderAchievements(summary, streak) {
  const container = document.getElementById("achievementsGrid");
  if (!container) return;
  const unlocked = checkNewAchievements(summary, streak);
  container.replaceChildren();
  ACHIEVEMENTS.forEach(a => {
    const isUnlocked = !!unlocked[a.id];
    const badge = el("div", { class: "achv-badge" + (isUnlocked ? " unlocked" : "") }, [
      el("span", { class: "achv-icon", "aria-hidden": "true", text: a.icon }),
      el("span", { class: "achv-name", text: t("achv_" + a.id + "_title") })
    ]);
    badge.title = isUnlocked ? t("achv_" + a.id + "_desc") : t("achievementLocked");
    container.appendChild(badge);
  });
}

// ===================================================================
// شهادة إتمام قابلة للتحميل — تُرسم على canvas وتُصدَّر كصورة PNG،
// بلا أي مكتبة خارجية أو اتصال بخادم.
// ===================================================================
function downloadCertificate(trackTitle) {
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

  ctx.direction = currentLang === "ar" ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.fillStyle = "#3D2E22";
  ctx.font = "bold 30px Cairo, sans-serif";
  ctx.fillText(t("appName"), canvas.width / 2, 160);

  ctx.font = "26px Cairo, sans-serif";
  ctx.fillStyle = "#5A4E40";
  ctx.fillText(t("certificateHeading"), canvas.width / 2, 260);

  ctx.font = "bold 46px Cairo, sans-serif";
  ctx.fillStyle = "#2F6F5E";
  ctx.fillText(trackTitle, canvas.width / 2, 380);

  ctx.font = "22px Cairo, sans-serif";
  ctx.fillStyle = "#5A4E40";
  ctx.fillText(t("certificateDate", { date: new Date().toLocaleDateString(currentLang) }), canvas.width / 2, 460);

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

function progressPercent(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
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
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.title = `${t("appName")} — ${t("appTagline")}`;
  document.getElementById("appName").textContent = t("appName");
  document.getElementById("appTagline").textContent = t("appTagline");
  document.getElementById("streakLabel").textContent = t("streakLabel");
  document.getElementById("heroKicker").textContent = t("today");
  document.getElementById("statCompletedLabel").textContent = t("statCompletedLabel");
  document.getElementById("statBooksLabel").textContent = t("statBooksLabel");
  document.getElementById("statFinishedLabel").textContent = t("statFinishedLabel");
  document.getElementById("searchInput").placeholder = t("searchPlaceholder");
  document.getElementById("searchInputLabel").textContent = t("searchLabel");
  document.getElementById("shelfNav").setAttribute("aria-label", t("categories"));
  document.getElementById("backToShelf").textContent = t("backToShelf");
  document.getElementById("resetProgress").textContent = t("resetProgress");
  document.getElementById("langSwitcher").setAttribute("aria-label", t("language"));
  document.getElementById("langSwitcher").value = currentLang;
  document.getElementById("exportBtn").setAttribute("aria-label", t("exportProgress"));
  document.getElementById("exportBtn").title = t("exportProgress");
  document.getElementById("importBtn").setAttribute("aria-label", t("importProgress"));
  document.getElementById("importBtn").title = t("importProgress");
  document.getElementById("achievementsTitle").textContent = t("achievementsTitle");
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
  toggle.title = isDark ? t("lightMode") : t("darkMode");
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
    onclick: () => { activeCategory = "all"; renderAll(); }
  });
  nav.appendChild(allChip);

  SKILL_DATA.forEach(cat => {
    const chip = el("button", {
      type: "button",
      class: "shelf-chip" + (activeCategory === cat.id ? " active" : ""),
      text: tr(cat.name),
      onclick: () => { activeCategory = cat.id; renderAll(); }
    });
    nav.appendChild(chip);
  });
}

// ===================================================================
// عرض الأرفف والكتب
// ===================================================================
function buildBookCard(cat, track, info) {
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

  const card = el("button", {
    type: "button",
    class: "book-card",
    "aria-label": finished ? `${tr(track.title)} — ${t("statFinishedLabel")}` : tr(track.title),
    onclick: () => openTrack(cat.id, track.id)
  }, [ribbon, meta, titleDiv, footer]);
  card.style.background = cat.spineColor;

  if (finished) {
    card.appendChild(el("div", { class: "book-done-badge", text: "✅", "aria-hidden": "true" }));
  }

  return card;
}

function renderShelves(summary) {
  const container = document.getElementById("shelvesContainer");
  container.replaceChildren();

  const categories = activeCategory === "all"
    ? SKILL_DATA
    : SKILL_DATA.filter(c => c.id === activeCategory);
  let matchingCategoryCount = 0;

  categories.forEach(cat => {
    const matchingTracks = cat.tracks.filter(track => {
      if (!searchQuery) return true;
      return tr(track.title).toLowerCase().includes(searchQuery)
        || tr(track.summary).toLowerCase().includes(searchQuery)
        || track.lessons.some(lesson => tr(lesson.title).toLowerCase().includes(searchQuery));
    });
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
  renderAchievements(summary, currentStreak);
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
  currentTrackRef = { categoryId, trackId };
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

function buildLessonItem(categoryId, trackId, lesson, idx, isDone) {
  const li = el("li", { class: "lesson-item" + (isDone ? " done" : "") });

  const checkbox = el("button", {
    class: "lesson-checkbox" + (isDone ? " checked" : ""),
    "aria-label": isDone ? t("lessonUndone") : t("lessonDone"),
    text: isDone ? "✓" : String(idx + 1),
    onclick: () => {
      const nowDone = !isDone;
      const ok = progressRepository.setLessonDone(categoryId, trackId, lesson.id, nowDone);
      if (ok && nowDone) {
        const streak = bumpStreak();
        showToast(t("lessonDoneToast", { count: streak.count }));
      }
      renderLessonList(categoryId, trackId);
      renderShelves(computeProgressSummary());
    }
  });

  const body = el("div", { class: "lesson-body" });
  body.appendChild(el("h3", { text: tr(lesson.title) }));
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

  li.appendChild(checkbox);
  li.appendChild(body);
  return li;
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

  const certWrap = document.getElementById("certificateWrap");
  if (certWrap) {
    certWrap.replaceChildren();
    if (track.lessons.length > 0 && done === track.lessons.length) {
      certWrap.appendChild(el("button", {
        type: "button",
        class: "btn-primary btn-certificate",
        text: t("downloadCertificate"),
        onclick: () => downloadCertificate(tr(track.title))
      }));
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
    renderLessonList(currentTrackRef.categoryId, currentTrackRef.trackId);
    renderShelves(computeProgressSummary());
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

// ===================================================================
// تصدير / استيراد التقدم — نسخة احتياطية بدون الحاجة إلى حساب أو خادم
// ===================================================================
function handleExportProgress() {
  const json = progressRepository.exportData();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = el("a", { href: url, download: `masar-progress-${getLocalDateKey()}.json` });
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
  renderShelves(summary);
  renderDashboard(summary);
}

applySavedTheme();
applyLanguageUI();
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
if (window.location.hash.startsWith(trackHashPrefix)) {
  const hashValue = window.location.hash.slice(trackHashPrefix.length);
  const separatorIndex = hashValue.indexOf("-");
  if (separatorIndex > 0) {
    const categoryId = hashValue.slice(0, separatorIndex);
    const trackId = hashValue.slice(separatorIndex + 1);
    initialTrackRef = { categoryId, trackId }; // نسمح بها حتى لو غير موجودة؛ openTrack سيعرض شاشة "غير موجود"
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
} else {
  renderAll();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    // دعم Offline اختياري ويجب ألا يوقف عمل التطبيق.
  });
}