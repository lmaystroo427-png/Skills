const CACHE_PREFIX = "masar-";
const CORE_CACHE_NAME = CACHE_PREFIX + "shell-v6";
const RUNTIME_CACHE_NAME = CACHE_PREFIX + "runtime-v6";

// ملفات التطبيق الأساسية: يجب أن تُخزَّن كلها بنجاح، وإلا فشل التثبيت
// عمداً (بدل إخفاء الخطأ وتثبيت نسخة offline ناقصة بصمت).
const CORE_FILES = [
  "./index.html",
  "./app.js",
  "./auth-sync.js",
  "./data.js",
  "./translations.js",
  "./style.css",
  "./manifest.json",
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
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
