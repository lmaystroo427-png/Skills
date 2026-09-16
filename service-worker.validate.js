// ===================================================================
// تحقق ثابت (static) وخفيف من service-worker.js — بلا إطار اختبار
// خارجي، بنفس فلسفة *.test.js الأخرى فـ المشروع.
//
// طريقة التشغيل:
//   node service-worker.validate.js
//
// يتحقق من:
//   1) كل مسار محلي (يبدأ بـ "./" وليس URL خارجي) داخل CORE_FILES
//      موجود فعليًا على القرص، بجانب هذا الملف.
//   2) لا يوجد أي مسار داخل CORE_FILES يشير إلى مجلد "js/core/" غير
//      الموجود فـ بنية المستودع الحالية.
//   3) الملفات الأساسية التي يحمّلها index.html عبر <script src> أو
//      <link rel="stylesheet"> (محليًا، بدون CDN) ممثّلة فعليًا داخل
//      CORE_FILES — حتى لا تُفقد offline بصمت.
// ===================================================================

const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const swSource = fs.readFileSync(path.join(DIR, "service-worker.js"), "utf8");
const htmlSource = fs.readFileSync(path.join(DIR, "index.html"), "utf8");

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log("  ✓ " + message);
  } else {
    failed++;
    failures.push(message);
    console.log("  ✗ " + message);
  }
}

// استخرج مصفوفة CORE_FILES من نص service-worker.js مباشرة (بلا eval،
// بلا require لملف بيئته self/caches غير متوفرة فـ Node).
const coreFilesMatch = swSource.match(/const CORE_FILES = \[([\s\S]*?)\];/);
if (!coreFilesMatch) {
  console.error("FATAL: تعذّر إيجاد CORE_FILES داخل service-worker.js");
  process.exit(1);
}
const CORE_FILES = Array.from(coreFilesMatch[1].matchAll(/"([^"]+)"/g)).map(m => m[1]);

console.log("\nService worker — CORE_FILES integrity (" + CORE_FILES.length + " entries)");

// 1) كل ملف محلي موجود فعليًا
const localEntries = CORE_FILES.filter(f => f.startsWith("./"));
let missing = [];
for (const entry of localEntries) {
  const filePath = path.join(DIR, entry);
  const exists = fs.existsSync(filePath);
  if (!exists) missing.push(entry);
}
assert(missing.length === 0, `every local CORE_FILES entry exists on disk (missing: ${missing.length})`);
if (missing.length) console.log("    missing:", missing.join(", "));

// 2) لا يوجد أي مسار js/core/ قديم
const staleJsCore = CORE_FILES.filter(f => f.includes("js/core/"));
assert(staleJsCore.length === 0, "no CORE_FILES entry points to the obsolete js/core/ directory");
if (staleJsCore.length) console.log("    stale:", staleJsCore.join(", "));

// 3) كل ملف محلي (script/link) فـ index.html ممثَّل فـ CORE_FILES
const localScriptSrcs = Array.from(htmlSource.matchAll(/<script src="(\.\/[^"]+)"/g)).map(m => m[1]);
const localLinkHrefs = Array.from(htmlSource.matchAll(/<link[^>]+href="(\.\/[^"]+)"/g)).map(m => m[1]);
const localHtmlAssets = [...localScriptSrcs, ...localLinkHrefs];

let notCached = [];
for (const asset of localHtmlAssets) {
  if (!CORE_FILES.includes(asset)) notCached.push(asset);
}
assert(notCached.length === 0, `every local script/stylesheet referenced by index.html is listed in CORE_FILES (uncached: ${notCached.length})`);
if (notCached.length) console.log("    not cached:", notCached.join(", "));

// index.html نفسه يجب أن يكون فـ CORE_FILES
assert(CORE_FILES.includes("./index.html"), "index.html itself is listed in CORE_FILES");

console.log(`\n${passed} passed, ${failed} failed (${passed + failed} total)`);
if (failed > 0) process.exit(1);
