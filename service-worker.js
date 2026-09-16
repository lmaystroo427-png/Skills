const CACHE_PREFIX = "masar-";
const CORE_CACHE_NAME = CACHE_PREFIX + "shell-v9";
const RUNTIME_CACHE_NAME = CACHE_PREFIX + "runtime-v9";

// ملفات التطبيق الأساسية: يجب أن تُخزَّن كلها بنجاح، وإلا فشل التثبيت
// عمداً (بدل إخفاء الخطأ وتثبيت نسخة offline ناقصة بصمت).
//
// ملاحظة: كانت هذه القائمة تشير سابقًا إلى "./js/core/constants.js" و
// "./js/core/masar-logic.js" رغم أن هذا المجلد غير موجود في المستودع
// فعليًا (الملفان في الجذر مباشرة كـ index.html وapp.js). كان هذا
// يعني فشل cache.addAll بالكامل عند أول تثبيت offline. صُحح المساران
// ليطابقا بنية المستودع الفعلية، ورُفع رقم إصدار الكاش إلى v9 حتى لا
// يبقى من ثبّت النسخة القديمة عالقًا بكاش فشل أصلًا.
const CORE_FILES = [
  "./index.html",
  "./constants.js",
  "./masar-logic.js",
  "./app.js",
  "./auth-sync.js",
  "./data.js",
  "./translations.js",
  "./style.css",
  "./manifest.json",
  "./exercises.js",
  "./project-workspace.js",
  "./skill-explorer.js",
  "./metrics-dashboard.js",
  "./community.js",
  "./public-profile.js",
  "./overlay-a11y.js",
  "./icon-192.svg",
  "./icon-512.svg",
  "./icon-192-maskable.svg",
  "./icon-512-maskable.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-192-maskable.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

// موارد خارجية (CDN) تُستخدم فعليًا في الصفحة: نخزنها في cache منفصل
// حتى لا تختلف تجربة offline عن تجربة online. لا تُفشل التثبيت إن
// تعذّر تنزيل أحدها (شبكة بطيئة مثلاً)، لكننا لا نُخفي ذلك بصمت كامل.
const RUNTIME_FILES = [
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const coreCache = await caches.open(CORE_CACHE_NAME);
      await coreCache.addAll(CORE_FILES); // atomic: يفشل التثبيت كله إذا فشل ملف أساسي

      const runtimeCache = await caches.open(RUNTIME_CACHE_NAME);
      await Promise.all(
        RUNTIME_FILES.map(url =>
          // استجابة no-cors تكون opaque، لذلك لا يمكن التحقق من status وقد
          // تُخزَّن استجابة فاشلة بصمت؛ لا حل كاملًا دون سياسة CORS من cdnjs.
          fetch(url, { mode: "no-cors" })
            .then(response => runtimeCache.put(url, response))
            .catch(err => console.warn("[service-worker] تعذّر تخزين مورد خارجي:", url, err))
        )
      );

      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CORE_CACHE_NAME && key !== RUNTIME_CACHE_NAME)
          .map(key => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).catch(() => {
        // لا يوجد تطابق فـ الكاش والشبكة غير متاحة (offline). بالنسبة
        // لطلبات التنقّل (navigation) — مثل فتح الجذر "/Skills/" مباشرة،
        // الذي لا يُطابق مفتاح الكاش "./index.html" لأن الـ URL مختلف
        // رغم أنه نفس الملف فعليًا — نُعيد قشرة التطبيق المخزَّنة بدل
        // ترك المتصفح بلا أي استجابة. المسار نسبي لنطاق الـ service
        // worker فـ GitHub Pages project site (يُحل إلى .../Skills/index.html)،
        // فلا حاجة لتفريغ الجذر "/" الخاطئ.
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }
        return undefined;
      });
    })
  );
});
