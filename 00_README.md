# Masar — ملاحظات الصيانة

هذا الملف يوثّق الحالة الفعلية للمستودع (وليس خطوات لصق يدوي).

## البنية

مشروع HTML/CSS/JavaScript vanilla + PWA بلا build step وبلا framework.
جميع الملفات تُحمَّل مباشرة عبر `<script>` في `index.html` من جذر المستودع
(لا يوجد مجلد `js/core/` — الملفات الأساسية `constants.js` و`masar-logic.js`
و`data.js` و`translations.js` كلها في الجذر).

## الاختبارات

```bash
node masar-logic.test.js
node skill-graph.real-data.test.js
```

كلاهما يستوردان من الملفات المجاورة لهما مباشرة (`./masar-logic.js`,
`./data.js`) — لا من مجلد `tests/` أو `js/core/` افتراضي غير موجود.

## ملاحظة تاريخية

كانت هناك سابقًا ملفات "patch" منفصلة (`01_...` إلى `06_...` و
`translations-additions.js`) تحمل تعليمات "افتح الملف الفلاني والصق هذا
الجزء يدويًا". تم التحقق فعليًا (بمطابقة المحتوى حرفيًا) من أن كل
محتواها مدمج بالفعل داخل `masar-logic.js` و`app.js` و`data.js` و
`translations.js`، وتم حذف تلك الملفات لأنها أصبحت مصدر حقيقة مكرر
وميت (dead code) — لا حاجة لأي لصق يدوي بعد الآن.

## PWA — service worker

```bash
node service-worker.validate.js
```

يتحقق أن كل ملف محلي داخل `CORE_FILES` موجود فعليًا، وأنه لا يشير إلى
مجلد `js/core/` غير موجود، وأن كل script/stylesheet محلي في
`index.html` مُمثَّل في الكاش. رُفع إصدار الكاش إلى `v9` بعد آخر تصحيح
لمسارات `CORE_FILES` حتى لا يبقى من ثبّت النسخة القديمة عالقًا بكاش فشل.

## النشر (Deployment)

هدف النشر الحالي هو **GitHub Pages** عبر
`.github/workflows/deploy.yml` (ينشر جذر المستودع مباشرة، بلا build
step، عند كل push على `main`). رابط الإنتاج الفعلي هو GitHub Pages
project site:

`https://lmaystroo427-png.github.io/Skills/`

حقول SEO (`canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD,
`sitemap.xml`, `robots.txt`) مضبوطة على هذا الرابط، بما فيه مسار
`/Skills/` (وليس الجذر `https://lmaystroo427-png.github.io/`). لا يوجد
دومين مخصص (custom domain) معرَّف — إن أُضيف لاحقًا، يجب تحديث كل هذه
الحقول لتعكسه.
