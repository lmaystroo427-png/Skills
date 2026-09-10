// ===== حالة التطبيق =====
const STORAGE_KEY = "masar_progress_v1";
const STREAK_KEY = "masar_streak_v1";
const THEME_KEY = "masar_theme_v1";
const LANG_KEY = "masar_lang_v1";
const SUPPORTED_LANGS = ["en", "ar", "ary", "fr", "es", "pt", "it", "de"];

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
  document.getElementById("searchInput").setAttribute("aria-label", t("searchPlaceholder"));
  document.getElementById("shelfNav").setAttribute("aria-label", t("categories"));
  document.getElementById("backToShelf").textContent = t("backToShelf");
  document.getElementById("resetProgress").textContent = t("resetProgress");
  document.getElementById("langSwitcher").setAttribute("aria-label", t("language"));
  document.getElementById("langSwitcher").value = currentLang;
  updateThemeToggle(document.documentElement.getAttribute("data-theme") || "light");
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    // The selected language still applies for this session.
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
  toggle.innerHTML = `<span aria-hidden="true">${isDark ? "☀️" : "🌙"}</span>`;
  toggle.setAttribute("aria-label", isDark ? t("lightMode") : t("darkMode"));
  toggle.title = isDark ? t("lightMode") : t("darkMode");
}

function applySavedTheme() {
  let theme = "light";
  try {
    theme = localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch (e) {
    // Use the light theme when the browser blocks local storage access.
  }
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggle(theme);
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    showToast(t("saveError"));
  }
}

function loadStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: null };
  } catch (e) {
    return { count: 0, lastDate: null };
  }
}

function bumpStreak() {
  const streak = loadStreak();
  const today = new Date().toDateString();
  if (streak.lastDate === today) return streak; // already counted today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (streak.lastDate === yesterday) {
    streak.count += 1;
  } else {
    streak.count = 1;
  }
  streak.lastDate = today;
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch (e) {
    showToast(t("saveError"));
  }
  currentStreak = streak;
  return streak;
}

let progress = loadProgress();
let currentStreak = loadStreak();
let activeCategory = "all";
let searchQuery = "";
let currentTrackRef = null; // { categoryId, trackId }

// ===== أدوات مساعدة =====
function findTrack(categoryId, trackId) {
  const cat = SKILL_DATA.find(c => c.id === categoryId);
  if (!cat) return null;
  const track = cat.tracks.find(t => t.id === trackId);
  return { category: cat, track };
}

function getTrackProgress(categoryId, trackId) {
  const key = `${categoryId}::${trackId}`;
  return progress[key] || {};
}

function setLessonDone(categoryId, trackId, lessonIndex, done) {
  const key = `${categoryId}::${trackId}`;
  if (!progress[key]) progress[key] = {};
  progress[key][lessonIndex] = done;
  saveProgress(progress);
}

function countDone(categoryId, trackId, totalLessons) {
  if (totalLessons === 0) return 0;
  const p = getTrackProgress(categoryId, trackId);
  let done = 0;
  for (let i = 0; i < totalLessons; i++) if (p[i]) done++;
  return done;
}

function progressPercent(done, totalLessons) {
  return totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ===== حساب الإحصاءات العامة =====
function computeStats() {
  let totalDone = 0, booksInProgress = 0, booksFinished = 0;
  SKILL_DATA.forEach(cat => {
    cat.tracks.forEach(track => {
      const done = countDone(cat.id, track.id, track.lessons.length);
      totalDone += done;
      if (done > 0 && done < track.lessons.length) booksInProgress++;
      if (done === track.lessons.length) booksFinished++;
    });
  });
  return { totalDone, booksInProgress, booksFinished };
}

function findContinueTrack() {
  // أول كتاب فيه تقدم غير مكتمل، وإلا أول كتاب في القائمة
  for (const cat of SKILL_DATA) {
    for (const track of cat.tracks) {
      const done = countDone(cat.id, track.id, track.lessons.length);
      if (done > 0 && done < track.lessons.length) {
        return { category: cat, track, done };
      }
    }
  }
  const cat = SKILL_DATA[0];
  return { category: cat, track: cat.tracks[0], done: 0 };
}

// ===== عرض شريط التنقل بين الفئات =====
function renderShelfNav() {
  const nav = document.getElementById("shelfNav");
  nav.innerHTML = "";

  const allChip = document.createElement("button");
  allChip.className = "shelf-chip" + (activeCategory === "all" ? " active" : "");
  allChip.textContent = t("allShelves");
  allChip.onclick = () => { activeCategory = "all"; renderAll(); };
  nav.appendChild(allChip);

  SKILL_DATA.forEach(cat => {
    const chip = document.createElement("button");
    chip.className = "shelf-chip" + (activeCategory === cat.id ? " active" : "");
    chip.textContent = tr(cat.name);
    chip.onclick = () => { activeCategory = cat.id; renderAll(); };
    nav.appendChild(chip);
  });
}

// ===== عرض الأرفف والكتب =====
function renderShelves() {
  const container = document.getElementById("shelvesContainer");
  container.innerHTML = "";

  const categories = activeCategory === "all"
    ? SKILL_DATA
    : SKILL_DATA.filter(c => c.id === activeCategory);
  let matchingCategoryCount = 0;

  categories.forEach(cat => {
    const matchingTracks = cat.tracks.filter(track => {
      if (!searchQuery) return true;
      return tr(track.title).toLowerCase().includes(searchQuery)
        || tr(track.summary).toLowerCase().includes(searchQuery);
    });
    if (matchingTracks.length === 0) return;
    matchingCategoryCount++;

    const block = document.createElement("div");
    block.className = "shelf-block";

    const title = document.createElement("div");
    title.className = "shelf-title";
    title.innerHTML = `<span>${tr(cat.name)}</span><span class="count">${t("booksCount", { count: matchingTracks.length })}</span>`;
    block.appendChild(title);

    const row = document.createElement("div");
    row.className = "books-row";

    matchingTracks.forEach(track => {
      const done = countDone(cat.id, track.id, track.lessons.length);
      const pct = progressPercent(done, track.lessons.length);
      const finished = done === track.lessons.length;

      const card = document.createElement("div");
      card.className = "book-card";
      card.style.background = cat.spineColor;
      card.onclick = () => openTrack(cat.id, track.id);

      card.innerHTML = `
        <div class="book-ribbon" style="height:${Math.max(pct, 8)}%"></div>
        <div class="book-meta">
          <span class="track-level level-${track.level}">${TRACK_LEVEL_LABELS[track.level][currentLang] || TRACK_LEVEL_LABELS[track.level].en}</span>
          <span class="track-duration">${tr(track.duration)}</span>
        </div>
        <div class="book-title">${tr(track.title)}</div>
        <div>
          <div class="book-progress-label">${t("pageCount", { done, total: track.lessons.length })}</div>
          <div class="book-mini-progress"><div style="width:${pct}%"></div></div>
        </div>
        ${finished ? '<div class="book-done-badge">✅</div>' : ""}
      `;
      row.appendChild(card);
    });

    block.appendChild(row);
    container.appendChild(block);
  });

  if (matchingCategoryCount === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "search-empty";
    emptyMessage.textContent = t("noResults");
    container.appendChild(emptyMessage);
  }
}

// ===== لوحة القراءة (الصفحة الرئيسية) =====
function renderDashboard() {
  const stats = computeStats();
  document.getElementById("statCompleted").textContent = stats.totalDone;
  document.getElementById("statBooks").textContent = stats.booksInProgress;
  document.getElementById("statFinished").textContent = stats.booksFinished;

  const cont = findContinueTrack();
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
}

// ===== عرض صفحة الكتاب (المسار) =====
function openTrack(categoryId, trackId, updateHistory = true) {
  currentTrackRef = { categoryId, trackId };
  const { category, track } = findTrack(categoryId, trackId);
  if (updateHistory) {
    history.pushState({ view: "track", categoryId, trackId }, "", `#track-${categoryId}-${trackId}`);
  }

  document.getElementById("dashboardView").classList.add("hidden");
  document.getElementById("trackView").classList.remove("hidden");

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

function renderLessonList(categoryId, trackId) {
  const { track } = findTrack(categoryId, trackId);
  const list = document.getElementById("lessonList");
  list.innerHTML = "";

  const p = getTrackProgress(categoryId, trackId);
  const done = countDone(categoryId, trackId, track.lessons.length);
  const pct = progressPercent(done, track.lessons.length);

  document.getElementById("trackProgressFill").style.width = pct + "%";
  document.getElementById("trackProgressText").textContent =
    t("progressText", { done, total: track.lessons.length, pct });

  track.lessons.forEach((lesson, idx) => {
    const isDone = !!p[idx];
    const li = document.createElement("li");
    li.className = "lesson-item" + (isDone ? " done" : "");

    const checkbox = document.createElement("button");
    checkbox.className = "lesson-checkbox" + (isDone ? " checked" : "");
    checkbox.setAttribute("aria-label", isDone ? t("lessonUndone") : t("lessonDone"));
    checkbox.textContent = isDone ? "✓" : (idx + 1);
    checkbox.onclick = () => {
      const nowDone = !isDone;
      setLessonDone(categoryId, trackId, idx, nowDone);
      if (nowDone) {
        const streak = bumpStreak();
        showToast(t("lessonDoneToast", { count: streak.count }));
      }
      renderLessonList(categoryId, trackId);
      renderShelves();
    };

    const body = document.createElement("div");
    body.className = "lesson-body";
    body.innerHTML = `<h3>${tr(lesson.title)}</h3><p class="lesson-tip">${tr(lesson.tip)}</p>`;

    li.appendChild(checkbox);
    li.appendChild(body);
    list.appendChild(li);
  });
}

document.getElementById("backToShelf").onclick = () => {
  history.pushState({ view: "dashboard" }, "", window.location.pathname);
  currentTrackRef = null;
  document.getElementById("trackView").classList.add("hidden");
  document.getElementById("dashboardView").classList.remove("hidden");
  renderAll();
};

document.getElementById("resetProgress").onclick = () => {
  if (!currentTrackRef || !confirm(t("resetConfirm"))) return;
  const key = `${currentTrackRef.categoryId}::${currentTrackRef.trackId}`;
  try {
    delete progress[key];
    saveProgress(progress);
    renderLessonList(currentTrackRef.categoryId, currentTrackRef.trackId);
    renderShelves();
  } catch (e) {
    showToast(t("resetError"));
  }
};

window.addEventListener("popstate", event => {
  const state = event.state;
  if (state && state.view === "track") {
    openTrack(state.categoryId, state.trackId, false);
    return;
  }

  currentTrackRef = null;
  document.getElementById("trackView").classList.add("hidden");
  document.getElementById("dashboardView").classList.remove("hidden");
  renderAll();
});

window.addEventListener("storage", event => {
  if (event.key === STORAGE_KEY || event.key === STREAK_KEY) {
    progress = loadProgress();
    currentStreak = loadStreak();
    renderAll();
    if (currentTrackRef) {
      renderLessonList(currentTrackRef.categoryId, currentTrackRef.trackId);
    }
  }
});

// ===== إعادة الرسم الشامل =====
function renderAll() {
  renderShelfNav();
  renderShelves();
  renderDashboard();
}

applySavedTheme();
applyLanguageUI();
document.getElementById("themeToggle").onclick = toggleTheme;
document.getElementById("langSwitcher").onchange = event => setLanguage(event.target.value);
document.getElementById("searchInput").addEventListener("input", event => {
  searchQuery = event.target.value.toLowerCase().trim();
  renderShelves();
});

let initialTrackRef = null;
const trackHashPrefix = "#track-";
if (window.location.hash.startsWith(trackHashPrefix)) {
  const hashValue = window.location.hash.slice(trackHashPrefix.length);
  const separatorIndex = hashValue.indexOf("-");
  if (separatorIndex > 0) {
    const categoryId = hashValue.slice(0, separatorIndex);
    const trackId = hashValue.slice(separatorIndex + 1);
    const result = findTrack(categoryId, trackId);
    if (result && result.track) {
      initialTrackRef = { categoryId, trackId };
    }
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
  navigator.serviceWorker.register("service-worker.js").catch(() => {
    // Offline support is optional and must not interrupt the application.
  });
}
