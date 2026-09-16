// ===================================================================
// منطق مسار الأساسي (Core logic) — دوال نقية قابلة للاختبار
// ===================================================================
// هذا الملف يفصل "الحساب" عن "العرض والتخزين". كل دالة هنا نقية بقدر
// الإمكان: مُعطى نفس المُدخلات، ترجع دائمًا نفس المُخرجات، بلا قراءة/
// كتابة DOM أو localStorage مباشرة. الدوال التي كانت أصلاً تعتمد على
// حالة عامة (SKILL_DATA، tr()، findTrack، PROGRESS_SCHEMA_VERSION) الآن
// تقبلها كمُعامل اختياري: لو لم يُمرَّر، تُستعمل القيمة العامة الموجودة
// فـ نطاق المتصفح (بنفس السلوك القديم تمامًا فـ app.js)، ولو مُرِّر
// (كما تفعل مجموعة الاختبارات فـ tests/) تُستعمل القيمة المُمرَّرة بدل
// أي حالة عامة — هذا ما يجعل هذه الدوال قابلة للاختبار فـ Node بمعزل
// عن المتصفح كليًا.
//
// أي دالة أخرى (renderX، buildX، أي شيء يلمس document أو localStorage
// مباشرة) تبقى عمدًا فـ app.js: فصلها يتطلب بيئة متصفح حقيقية (jsdom أو
// مماثل) لاختبارها، وهو خارج نطاق هذا التمرير الأول من إعادة الهيكلة.
// ===================================================================

// ---------- الستريك والتواريخ (calendar-safe streak math) ----------

// نسخة محلية الوقت (YYYY-MM-DD) بدل استعمال فرق الميلي ثانية، الذي يخطئ
// حول منتصف الليل أو عند تغييرات التوقيت الصيفي.
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

// الحساب النقي لما يجب أن يصبح عليه الستريك بعد نشاط اليوم، مفصول عن
// bumpStreak فـ app.js (الذي يتكفّل بالقراءة/الكتابة فـ localStorage
// وعرض toast). مُعطى الستريك الحالي وتاريخ اليوم، يرجع الستريك الجديد
// دون أي أثر جانبي — هذا هو بالضبط المنطق الذي كان مطمورًا داخل bumpStreak.
function computeNextStreak(streak, today = getLocalDateKey()) {
  const current = streak || { count: 0, lastDate: null };
  if (current.lastDate === today) return { ...current }; // مُحتسب اليوم بالفعل
  const yesterday = addDays(today, -1);
  return {
    count: current.lastDate === yesterday ? current.count + 1 : 1,
    lastDate: today
  };
}

// ---------- النسب والمستويات (progress & XP math) ----------

function progressPercent(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

// منحنى تصاعدي بسيط: كل مستوى يحتاج نقاطًا أكثر من سابقه، لتفادي قفز
// المستخدم عدة مستويات دفعة واحدة بعد أول درس فقط.
function computeLevel(xp) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)) + 1);
}

function xpForLevel(level) {
  return Math.pow(level - 1, 2) * 50;
}

// ---------- سلامة مخطط التقدم (progress state integrity) ----------

function isValidProgressState(obj, schemaVersion = (typeof PROGRESS_SCHEMA_VERSION !== "undefined" ? PROGRESS_SCHEMA_VERSION : 2)) {
  return !!obj && typeof obj === "object"
    && obj.version === schemaVersion
    && obj.tracks && typeof obj.tracks === "object";
}

// يحوّل المخطط القديم (index-based) إلى الجديد (id-based) بأفضل ما يمكن،
// بافتراض أن ترتيب الدروس وقت هذا الترحيل مطابق للترتيب الذي أنجز به
// المستخدم دروسه سابقًا (وهو افتراض معقول لأنه أول ترحيل من هذا النوع).
// findTrackFn قابل للحقن (dependency injection) بدل الاعتماد على دالة
// findTrack العامة مباشرة، بحيث يمكن اختبار هذه الدالة بمعزل عن SKILL_DATA
// الحقيقي فـ Node.
function migrateLegacyProgress(
  legacyParsed,
  findTrackFn = (typeof findTrack === "function" ? findTrack : () => null),
  schemaVersion = (typeof PROGRESS_SCHEMA_VERSION !== "undefined" ? PROGRESS_SCHEMA_VERSION : 2)
) {
  const migrated = { version: schemaVersion, tracks: {} };
  if (!legacyParsed || typeof legacyParsed !== "object") return migrated;

  Object.keys(legacyParsed).forEach(compositeKey => {
    const sepIndex = compositeKey.indexOf("::");
    if (sepIndex === -1) return;
    const categoryId = compositeKey.slice(0, sepIndex);
    const trackId = compositeKey.slice(sepIndex + 2);
    const result = findTrackFn(categoryId, trackId);
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

// ---------- سلامة مخطط المهارات (skill graph integrity) ----------

// يتحقق من معرّفات متطلبات سابقة مكتوبة خطأ، أو حلقة متطلبات دائرية
// (A يتطلب B وB يتطلب A). skillData قابل للحقن لنفس سبب migrateLegacyProgress
// أعلاه: يسمح باختبار المنطق بمعزل عن بيانات المنصة الحقيقية.
function validateSkillGraph(skillData = (typeof SKILL_DATA !== "undefined" ? SKILL_DATA : [])) {
  const allTrackIds = new Set();
  skillData.forEach(cat => cat.tracks.forEach(trk => allTrackIds.add(trk.id)));

  const findTrackAnywhereIn = trackId => {
    for (const category of skillData) {
      const track = category.tracks.find(trk => trk.id === trackId);
      if (track) return { category, track };
    }
    return null;
  };

  const orphanedRefs = [];
  skillData.forEach(cat => cat.tracks.forEach(trk => {
    (trk.prerequisites || []).forEach(prereqId => {
      if (!allTrackIds.has(prereqId)) orphanedRefs.push(`${trk.id} -> ${prereqId}`);
    });
  }));

  // كشف الحلقات عبر DFS كلاسيكي بثلاث حالات لكل عقدة: لم تُزَر، قيد
  // الزيارة (على المسار الحالي)، تمت زيارتها بالكامل.
  const cycles = [];
  const state = new Map(); // trackId -> "visiting" | "done"
  function visit(trackId, path) {
    if (state.get(trackId) === "done") return;
    if (state.get(trackId) === "visiting") {
      cycles.push([...path, trackId].join(" -> "));
      return;
    }
    state.set(trackId, "visiting");
    const found = findTrackAnywhereIn(trackId);
    const prereqs = found ? (found.track.prerequisites || []) : [];
    prereqs.forEach(p => visit(p, [...path, trackId]));
    state.set(trackId, "done");
  }
  allTrackIds.forEach(id => visit(id, []));

  if (orphanedRefs.length && typeof console !== "undefined") {
    console.warn("[Masar] Skill graph: prerequisite(s) pointing to a non-existent track:", orphanedRefs);
  }
  if (cycles.length && typeof console !== "undefined") {
    console.warn("[Masar] Skill graph: circular prerequisite chain(s) detected:", cycles);
  }
  return { orphanedRefs, cycles };
}

// ---------- بحث الأرفف (shelf search scoring) ----------

// مسافة ليفنشتاين البسيطة (عدد التعديلات الدنيا لتحويل كلمة لأخرى)،
// تُستعمل فقط كخط دفاع ثانٍ للبحث التقريبي (fuzzy)، بعد فشل المطابقة
// الحرفية الكاملة. تُبقي التعقيد منخفضًا (كلمات قصيرة عادةً) فلا داعي
// لخوارزمية أكثر تعقيدًا.
function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

// تحقق تقريبي (fuzzy): يبحث عن كلمة داخل النص (مقسّمًا على الفراغات
// وعلامات الترقيم) قريبة جدًا من الكلمة المطلوبة (خطأ إملائي واحد أو
// اثنين حسب الطول)، لا يُستدعى إلا بعد فشل المطابقة الحرفية الكاملة،
// ولا يُطبَّق على كلمات قصيرة جدًا (أقل من 4 أحرف) تفاديًا لتطابقات
// عشوائية كثيرة الضجيج.
function fuzzyWordMatch(text, token) {
  if (token.length < 4) return false;
  const maxDistance = token.length <= 5 ? 1 : 2;
  const words = text.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return words.some(word => Math.abs(word.length - token.length) <= maxDistance
    && levenshteinDistance(word, token) <= maxDistance);
}

// بحث مبني على تسجيل نقاط لكل كلمة بحث (token) عبر عدة حقول (العنوان،
// الفئة، الملخص، عناوين الدروس) بدل مطابقة نصية خام واحدة. كل كلمة فـ
// الاستعلام يجب أن تجد لها مكانًا فأحد الحقول (AND بين الكلمات، OR بين
// الحقول). trFn قابل للحقن بدل الاعتماد على tr() العامة (التي تحتاج
// currentLang/UI_STRINGS)، فيمكن اختبار منطق التسجيل بمعزل عن الترجمة.
//
// دعم تقريبي (fuzzy): إذا لم تجد كلمة أي تطابق حرفي فـ أي حقل، نجرّب
// مطابقة تقريبية (خطأ إملائي بسيط) قبل إقصاء المسار كليًا. هذا يعطي
// نقاطًا أقل من المطابقة الحرفية عمدًا، لأنه أقل دقة.
function scoreTrackAgainstSearch(cat, track, tokens, trFn = (typeof tr === "function" ? tr : (obj) => (obj && typeof obj === "object" ? (obj.en || "") : (obj || "")))) {
  if (!tokens.length) return 0;
  const titleText = trFn(track.title).toLowerCase();
  const summaryText = trFn(track.summary).toLowerCase();
  const categoryText = trFn(cat.name).toLowerCase();
  const lessonTexts = track.lessons.map(lesson => trFn(lesson.title).toLowerCase());
  const allFieldsText = [titleText, categoryText, summaryText, ...lessonTexts];

  let score = 0;
  for (const token of tokens) {
    let tokenMatched = false;
    if (titleText.includes(token)) { score += titleText.startsWith(token) ? 6 : 4; tokenMatched = true; }
    if (categoryText.includes(token)) { score += 2; tokenMatched = true; }
    if (summaryText.includes(token)) { score += 1; tokenMatched = true; }
    if (lessonTexts.some(text => text.includes(token))) { score += 1; tokenMatched = true; }
    if (!tokenMatched && allFieldsText.some(text => fuzzyWordMatch(text, token))) {
      score += 1; // نقطة تقريبية واحدة فقط: كافية لعدم الإقصاء، غير كافية لتصدر النتائج الدقيقة
      tokenMatched = true;
    }
    if (!tokenMatched) return null; // كلمة واحدة بلا أي تطابق (حتى تقريبي) تكفي لإقصاء المسار
  }
  return score;
}

// ---------- إشارة الفشل المتكرر (repeated-failure signal) ----------
// دالة نقية: مُعطاة قائمة محاولات (بترتيب حدوثها الزمني، كل محاولة
// كائن فيه على الأقل { passed: bool } أو { correct: bool })، ترجع عدد
// المحاولات الفاشلة المتتالية الأخيرة (0 إن كانت آخر محاولة ناجحة).
// هذا هو الأساس الذي يُبنى عليه "فشل المستخدم مرتين متتاليتين" (§14/§5
// من المواصفة: "User failed D twice → recommend prerequisite first")
// بدل الاكتفاء بنسبة إتمام عامة لا تميّز الفشل المتكرر عن التقدم البطيء.
function countConsecutiveFailedAttempts(attempts) {
  if (!Array.isArray(attempts) || !attempts.length) return 0;
  let count = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    const attempt = attempts[i];
    const failed = attempt && (attempt.passed === false || attempt.correct === false);
    if (!failed) break;
    count++;
  }
  return count;
}

// ---------- ترحيل سجل الاختبار النهائي إلى شكل يحتفظ بالتاريخ ----------
// المخطط القديم: { [trackId]: result } — نتيجة أخيرة واحدة فقط، تُسحق
// عند كل محاولة جديدة (retake)، فلا يمكن معرفة هل فشل المستخدم من قبل.
// المخطط الجديد: { [trackId]: { attempts: [result, ...], latest: result } }
// يحافظ على كامل تاريخ المحاولات (بأدنى حد، النتائج المُصحَّحة فقط، لا
// أي بيانات حساسة إضافية)، بحيث تصبح "فشل مرتين" إشارة حقيقية قابلة
// للحساب بدل افتراضها. الدالة نقية وقابلة للاختبار بمعزل عن localStorage:
// تقبل الشكلين (قديم وجديد) وترجع دائمًا الشكل الجديد الموحّد.
function normalizeAssessmentHistory(raw) {
  const result = {};
  if (!raw || typeof raw !== "object") return result;
  Object.keys(raw).forEach(trackId => {
    const entry = raw[trackId];
    if (!entry || typeof entry !== "object") return;
    if (Array.isArray(entry.attempts)) {
      // شكل جديد بالفعل: نسخة دفاعية بدل الإشارة المباشرة لنفس الكائن.
      result[trackId] = { attempts: [...entry.attempts], latest: entry.latest || entry.attempts[entry.attempts.length - 1] || null };
    } else if ("passed" in entry || "pct" in entry) {
      // شكل قديم (نتيجة واحدة مباشرة): نلفّها فـ attempts بمحاولة وحيدة،
      // بلا افتراض أي فشل سابق لم يُسجَّل أصلًا (لا بيانات = لا افتراض).
      result[trackId] = { attempts: [entry], latest: entry };
    }
  });
  return result;
}

// ---------- تحديد أولوية "المتطلب السابق الفاشل" فـ التوصيات ----------
// دالة نقية: مُعطى مخطط الاختبارات الموحّد (من normalizeAssessmentHistory)
// ومعرّف مسار، ترجع عدد محاولات الفشل المتتالية لذلك المسار تحديدًا.
// تُستعمل فـ app.js لترجيح توصية "أكمل هذا المتطلب أولًا" على أي توصية
// أخرى إن فشل المستخدم فيه مرتين متتاليتين أو أكثر — تطبيقًا حرفيًا
// للمثال الوارد فـ §14: "User failed D twice → recommend C before E"
// (هنا: فشل فـ المتطلب مرتين → رجّحه قبل أي مسار متقدم آخر).
function computeFailurePriorityBoost(assessmentHistory, trackId, minFailures = 2) {
  const entry = assessmentHistory && assessmentHistory[trackId];
  if (!entry) return { failCount: 0, shouldPrioritize: false };
  const failCount = countConsecutiveFailedAttempts(entry.attempts);
  return { failCount, shouldPrioritize: failCount >= minFailures };
}

// ===================================================================
// §6: حساب حقيقي لمكوّن "الاستيعاب طويل المدى" (Retention)
// ===================================================================
// كان هذا المكوّن معروضًا دائمًا كـ"لا توجد بيانات كافية" فـ mastery
// panel، رغم أن بيانات التكرار المتباعد (RETENTION_KEY، عبر
// scheduleLessonReview فـ app.js) كانت موجودة أصلاً منذ البداية —
// ببساطة لم يكن أحد يقرأها هنا. هذه الدالة نقية: تقبل قائمة دروس
// المسار، خريطة الدروس المُنجزة، وحالة retention الخام (بصيغة
// scheduleLessonReview: { [lessonId]: { interval, ease, nextDue, ... } })،
// وترجع نسبة مئوية أو null إن لم تتوفر بيانات كافية بعد (بصدق، بدل رقم
// مختلق).
//
// المنطق: لا معنى لقياس "استيعاب" درسٍ لم يُنجز بعد أصلاً، فنقتصر على
// الدروس المُنجزة فقط. من بينها، الدرس يُعتبر "مستوعبًا جيدًا" إن كانت
// قيمة ease (سهولة التذكر فـ خوارزمية SM-2 المبسّطة المستعملة أصلاً فـ
// scheduleLessonReview) لا تزال عند أو فوق قيمتها الابتدائية (2.5)،
// وinterval لا يزال يتّسع (>= 1) بدل الانهيار المتكرر لـ 1 (علامة على
// نسيان متكرر). إن لم يكن للدرس أي سجل مراجعة إطلاقًا (لم تُجدول له
// مراجعة قط)، لا نُدرجه فـ الحساب أصلاً — لأنه لا دليل بعد على استيعابه
// أو نسيانه، لا لأنه "فاشل".
function computeRetentionScore(lessons, completedLessons, retentionState, healthyEaseThreshold = 2.3) {
  if (!Array.isArray(lessons) || !lessons.length) return null;
  const completedLessonList = lessons.filter(lesson => completedLessons && completedLessons[lesson.id]);
  if (!completedLessonList.length) return null;

  const reviewed = completedLessonList.filter(lesson => retentionState && retentionState[lesson.id]);
  if (!reviewed.length) return null; // لا توجد بيانات مراجعة كافية بعد — صدق بدل رقم مختلق

  const healthyCount = reviewed.filter(lesson => {
    const entry = retentionState[lesson.id];
    return (entry.ease || 0) >= healthyEaseThreshold && (entry.interval || 0) >= 1;
  }).length;

  return {
    pct: Math.round((healthyCount / reviewed.length) * 100),
    reviewedCount: reviewed.length,
    totalCompleted: completedLessonList.length
  };
}

// ===================================================================
// §40: تدخيل (interleaving) عناصر قائمة المراجعة/اليوم عبر المهارات
// ===================================================================
// كانت getDueReviews ترتّب حسب عنوان الدرس أبجديًا فقط: لو كان عند
// المستخدم 5 مراجعات مستحقة من نفس المسار، تظهر كتلة متتالية من نفس
// المهارة بدل التنويع بينها — بعكس مبدأ "التدخيل" (interleaving) فـ
// علوم التعلّم (§40)، الذي يُظهر تحسّن الاستيعاب طويل المدى عند خلط
// مواضيع مختلفة بدل تكرار نفس الموضوع دفعة واحدة (blocking).
//
// دالة نقية: تقبل قائمة عناصر وenginedالة استخراج "مفتاح التصنيف" لكل
// عنصر (مثلاً trackId)، وتُعيد ترتيبها بحيث لا يتكرر نفس المفتاح مرتين
// متتاليتين إن أمكن ذلك (خوارزمية round-robin بسيطة عبر مجموعات
// المفاتيح). لا تُسقط أي عنصر ولا تُضيف أي عنصر — فقط تعيد الترتيب.
function interleaveByKey(items, keyFn) {
  if (!Array.isArray(items) || items.length <= 2) return items ? items.slice() : [];

  const groups = new Map(); // key -> [items...]
  items.forEach(item => {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  const queues = Array.from(groups.values());
  const result = [];
  let remaining = items.length;
  let cursor = 0;
  while (remaining > 0) {
    // نمر دورة كاملة على كل المجموعات (round-robin)؛ نتخطى المجموعات
    // الفارغة بصمت بدل كسر الحلقة.
    const queue = queues[cursor % queues.length];
    if (queue.length) {
      result.push(queue.shift());
      remaining--;
    }
    cursor++;
    // حماية من حلقة لا نهائية إن كانت كل المجموعات فارغة فعليًا (لا
    // يجب أن يحدث نظريًا بما أن remaining يتتبّع العدد الحقيقي، لكن هذا
    // تحوّط دفاعي رخيص).
    if (cursor > items.length * queues.length + 10) break;
  }
  return result;
}

// ===================================================================
// §38/§39: تدقيق سلامة/اكتمال محتوى المنهج (content schema audit)
// ===================================================================
// دالة نقية بحتة (بلا أي كتابة/تعديل): تفحص SKILL_DATA وترجع تقريرًا
// بالحقول الاختيارية المفيدة تربويًا (why, explain, tip) الناقصة لكل
// درس، بدل اختلاق محتوى حشو (§39 يمنع صراحة توليد filler). الهدف هو
// جعل الفجوات مرئية وقابلة للفرز أولويًا لفريق المحتوى، لا سدّها آليًا.
// skillData قابل للحقن (نفس نمط validateSkillGraph) للاختبار بمعزل عن
// بيانات المنصة الحقيقية.
// اللغات المدعومة على مستوى المنصة لحقول المحتوى متعددة اللغات
// (why/explain/tip/title). en هي اللغة الاحتياطية الشاملة (انظر اختبار
// "every lesson has an English title fallback").
const SUPPORTED_CONTENT_LANGUAGES = ["en", "ar", "ary", "fr", "es", "pt", "it", "de"];

// يفحص حقلًا متعدد اللغات (مثل lesson.why) لدرس معيّن ويرجع، لكل لغة
// مدعومة، حالتها الدقيقة: field_missing (الحقل نفسه غائب كليًا)،
// translation_missing (الحقل موجود لكن لا قيمة لهذه اللغة)،
// translation_empty (القيمة موجودة لكنها سلسلة فارغة/بيضاء)، أو
// present (ترجمة فعلية موجودة). هذا أدق من فحص "الحقل موجود؟" وحده،
// لأنه يميّز بين نقص جزئي (بعض اللغات) ونقص كلي.
function auditLanguageField(fieldValue) {
  const statusByLang = {};
  if (!fieldValue || typeof fieldValue !== "object") {
    SUPPORTED_CONTENT_LANGUAGES.forEach(lang => { statusByLang[lang] = "field_missing"; });
    return statusByLang;
  }
  SUPPORTED_CONTENT_LANGUAGES.forEach(lang => {
    const val = fieldValue[lang];
    if (val === undefined || val === null) statusByLang[lang] = "translation_missing";
    else if (typeof val === "string" && val.trim() === "") statusByLang[lang] = "translation_empty";
    else statusByLang[lang] = "present";
  });
  return statusByLang;
}

function auditContentCompleteness(skillData = (typeof SKILL_DATA !== "undefined" ? SKILL_DATA : [])) {
  const missingWhy = [];
  const missingExplain = [];
  const missingTip = [];
  let totalLessons = 0;

  // تدقيق متعدد اللغات لـ "why" تحديدًا (§39): لكل لغة مدعومة، قائمة
  // مراجع الدروس التي لا تملك ترجمة فعلية بها (سواء الحقل كله غائب،
  // أو الترجمة لتلك اللغة تحديدًا غائبة/فارغة).
  const whyMissingByLanguage = {};
  SUPPORTED_CONTENT_LANGUAGES.forEach(lang => { whyMissingByLanguage[lang] = []; });
  let whyCompleteAllLanguages = 0;

  skillData.forEach(category => {
    category.tracks.forEach(track => {
      track.lessons.forEach(lesson => {
        totalLessons++;
        const ref = `${category.id}::${track.id}::${lesson.id}`;
        if (!lesson.why) missingWhy.push(ref);
        if (!lesson.explain) missingExplain.push(ref);
        if (!lesson.tip) missingTip.push(ref);

        const whyStatus = auditLanguageField(lesson.why);
        let allLangsPresent = true;
        SUPPORTED_CONTENT_LANGUAGES.forEach(lang => {
          if (whyStatus[lang] !== "present") {
            whyMissingByLanguage[lang].push(ref);
            allLangsPresent = false;
          }
        });
        if (allLangsPresent) whyCompleteAllLanguages++;
      });
    });
  });

  const whyLanguageSummary = {};
  SUPPORTED_CONTENT_LANGUAGES.forEach(lang => {
    whyLanguageSummary[lang] = `${totalLessons - whyMissingByLanguage[lang].length}/${totalLessons}`;
  });

  return {
    totalLessons,
    missingWhy, missingExplain, missingTip,
    completenessPct: totalLessons === 0 ? 100 : Math.round(
      ((totalLessons * 3 - missingWhy.length - missingExplain.length - missingTip.length) / (totalLessons * 3)) * 100
    ),
    // --- تدقيق متعدد اللغات (جديد) ---
    supportedContentLanguages: SUPPORTED_CONTENT_LANGUAGES,
    whyMissingByLanguage,
    whyLanguageSummary,
    whyCompleteAllLanguages,
    whyCompleteAllLanguagesSummary: `${whyCompleteAllLanguages}/${totalLessons}`
  };
}

// ===================================================================
// PATCH §5 — مخطط مهارات دقيق على مستوى الدرس (Fine-grained lesson-level
// skill graph). كل درس يمكن أن يحمل حقلًا اختياريًا جديدًا
// "requires": [lessonId, ...] يشير لدروس أخرى (عادة فـ نفس المسار)
// يُستحسن إنجازها أولًا. الحقل اختياري بالكامل: أي درس بلا "requires"
// يستمر بالعمل بالضبط كما كان (بلا أي تغيير فـ السلوك أو الحاجة لأي
// migration، لأنه لا يمس progressRepository أو أي بيانات محفوظة).
// نفس فلسفة "soft prerequisite" غير الحاجبة المتبعة أصلاً فـ
// getIncompletePrerequisites على مستوى المسار.
// ===================================================================

// يرجع قائمة الدروس (كائنات lesson كاملة) التي يتطلبها درس معين ولم
// تُنجَز بعد، بناءً على حقل lesson.requires الاختياري. allLessons يجب
// أن تكون دروس نفس المسار (أو أي قائمة دروس أوسع تحوي المعرّفات
// المُشار إليها). لا تمنع فتح الدرس أبدًا — معلومة إرشادية فقط.
function getIncompleteLessonPrerequisites(lesson, allLessons, completedLessons) {
  if (!lesson || !lesson.requires || !lesson.requires.length) return [];
  const byId = new Map((allLessons || []).map(l => [l.id, l]));
  return lesson.requires
    .map(id => byId.get(id))
    .filter(Boolean)
    .filter(prereqLesson => !completedLessons || !completedLessons[prereqLesson.id]);
}

// تدقيق سلامة مخطط الدروس عبر كل SKILL_DATA: يكشف معرّفات "requires"
// مكتوبة خطأ (تشير لدرس غير موجود فـ نفس المسار) أو حلقات دائرية
// (درس أ يتطلب ب وب يتطلب أ)، بنفس منطق DFS المستعمل أصلاً فـ
// validateSkillGraph على مستوى المسار. لا تُظهر شيئًا للمستخدم ولا
// توقف التطبيق أبدًا — تحذير فـ console فقط، عند الإقلاع.
function validateLessonGraph(skillData = (typeof SKILL_DATA !== "undefined" ? SKILL_DATA : [])) {
  const orphanedRefs = [];
  const cycles = [];

  skillData.forEach(cat => cat.tracks.forEach(track => {
    const idsInTrack = new Set(track.lessons.map(l => l.id));
    const state = new Map(); // lessonId -> "visiting" | "done"

    function visit(lessonId, path) {
      if (state.get(lessonId) === "done") return;
      if (state.get(lessonId) === "visiting") {
        cycles.push([...path, lessonId].join(" -> "));
        return;
      }
      state.set(lessonId, "visiting");
      const lesson = track.lessons.find(l => l.id === lessonId);
      (lesson && lesson.requires || []).forEach(reqId => {
        if (!idsInTrack.has(reqId)) {
          orphanedRefs.push(`${track.id}::${lessonId} -> ${reqId}`);
        } else {
          visit(reqId, [...path, lessonId]);
        }
      });
      state.set(lessonId, "done");
    }

    track.lessons.forEach(l => visit(l.id, []));
  }));

  if (orphanedRefs.length && typeof console !== "undefined") {
    console.warn("[Masar] Lesson graph: requires pointing to a non-existent lesson id:", orphanedRefs);
  }
  if (cycles.length && typeof console !== "undefined") {
    console.warn("[Masar] Lesson graph: circular lesson requirement(s) detected:", cycles);
  }
  return { orphanedRefs, cycles };
}

// ===================================================================
// PATCH §22 — البحث يشمل الآن LEARNING_PATHS أيضًا (نفس منطق التسجيل
// المستعمل أصلاً لـ scoreTrackAgainstSearch، لكن على حقلي
// title/description لمسار مهني بدل track).
// ===================================================================
function scorePathAgainstSearch(path, tokens, trFn = (typeof tr === "function" ? tr : (obj) => (obj && typeof obj === "object" ? (obj.en || "") : (obj || "")))) {
  if (!tokens.length) return 0;
  const titleText = trFn(path.title).toLowerCase();
  const descText = trFn(path.description).toLowerCase();

  let score = 0;
  for (const token of tokens) {
    let tokenMatched = false;
    if (titleText.includes(token)) { score += titleText.startsWith(token) ? 6 : 4; tokenMatched = true; }
    if (descText.includes(token)) { score += 1; tokenMatched = true; }
    if (!tokenMatched && fuzzyWordMatch(titleText + " " + descText, token)) {
      score += 1;
      tokenMatched = true;
    }
    if (!tokenMatched) return null;
  }
  return score;
}

// دعم Node (tests/) بجانب المتصفح — نفس نمط constants.js.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getLocalDateKey, addDays, normalizeStreak, computeNextStreak,
    progressPercent, computeLevel, xpForLevel,
    isValidProgressState, migrateLegacyProgress, validateSkillGraph,
    scoreTrackAgainstSearch, levenshteinDistance, fuzzyWordMatch,
    countConsecutiveFailedAttempts, normalizeAssessmentHistory, computeFailurePriorityBoost,
    computeRetentionScore, interleaveByKey, auditContentCompleteness,
    getIncompleteLessonPrerequisites, validateLessonGraph, scorePathAgainstSearch,
    SUPPORTED_CONTENT_LANGUAGES, auditLanguageField
  };
}
