// ===================================================================
// إمكانية وصول عامة للنوافذ المنبثقة (Overlay accessibility, §26)
// ===================================================================
// كانت كل النوافذ المنبثقة (auth, onboarding, skill explorer, metrics,
// project workspace, public profile) تُغلَق بـ Escape فقط للأولى
// والثانية (auth/onboarding)، عبر معالج مكتوب يدويًا فـ app.js يعرف
// اسميًا عنهما فقط. البقية (4 نوافذ) لم يكن لها إغلاق بالكيبورد إطلاقًا،
// ولا حبس تركيز (focus trap) — ما يعني أن مستخدم لوحة مفاتيح يقدر
// يـ"tab" للخارج نحو المحتوى المحجوب خلف الطبقة الشفافة، وهذا خرق
// حقيقي لإمكانية الوصول (WCAG 2.1 §2.1.2 لا حبس كيبورد، لكن أيضًا
// §2.4.3 ترتيب تركيز منطقي يتطلب العكس داخل نافذة منبثقة فعلية).
//
// هذا الملف عام بالكامل: يعمل على أي نافذة حالية أو مستقبلية تتبع نفس
// نمط CSS الموجود أصلاً فـ style.css (".auth-overlay" + كلاس "hidden"
// يُبدَّل لإظهار/إخفاء)، بلا الحاجة لتعديل كل دالة open()/close() على
// حدة. يراقب تغيّر class عبر MutationObserver فقط — أي طريقة إظهار/
// إخفاء موجودة أصلاً (classList.remove/add("hidden")) تستمر بالعمل
// بلا أي تغيير.
//
// يجب تحميل هذا الملف بعد كل الملفات التي تُعرّف النوافذ فـ index.html
// (بعد public-profile.js مثلاً)، حتى تكون كل العناصر موجودة فـ DOM.
// ===================================================================

(function () {
  const OVERLAY_IDS = [
    "authModalOverlay",
    "onboardingOverlay",
    "skillExplorerOverlay",
    "metricsDashboardOverlay",
    "projectWorkspaceOverlay",
    "publicProfileOverlay"
  ];

  const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(", ");

  // آخر عنصر كان يحمل التركيز قبل فتح كل نافذة — لإرجاع التركيز إليه
  // عند الإغلاق (بدل تركه يسقط على <body>، وهو سلوك مربك لمستخدم قارئ
  // الشاشة أو لوحة المفاتيح).
  const lastFocusedByOverlay = new Map();

  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(el => {
      // offsetParent يكون null للعناصر المخفية (display:none) أو داخل
      // حاوية مخفية — تجنّبًا لمحاولة تركيز عنصر غير مرئي فعليًا.
      return el.offsetParent !== null;
    });
  }

  function trapFocusWithin(overlay, event) {
    if (event.key !== "Tab") return;
    const focusable = getFocusableElements(overlay);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function findCloseTrigger(overlay) {
    // يبحث عن أول زر إغلاق حقيقي داخل النافذة (النمط المتّبع فـ كل
    // النوافذ الموجودة: معرّف ينتهي بـ Close/CloseBtn، أو كلاس auth-close)
    // بدل افتراض اسم دالة closeX محدد لكل نافذة.
    return overlay.querySelector('[id$="CloseBtn"], [id$="Close"], .auth-close');
  }

  function onOverlayOpened(overlay) {
    lastFocusedByOverlay.set(overlay.id, document.activeElement);
    const focusable = getFocusableElements(overlay);
    // نُركّز أول عنصر تفاعلي حقيقي (غالبًا زر الإغلاق)، لا النافذة
    // نفسها، حتى يعرف مستخدم قارئ الشاشة فورًا أنه دخل سياقًا جديدًا
    // وأنه يقدر يتفاعل معه مباشرة بلا خطوة Tab إضافية.
    (focusable[0] || overlay).focus({ preventScroll: true });

    overlay._a11yTrapHandler = event => trapFocusWithin(overlay, event);
    overlay.addEventListener("keydown", overlay._a11yTrapHandler);

    const main = document.getElementById("mainView");
    if (main) main.setAttribute("aria-hidden", "true");
  }

  function onOverlayClosed(overlay) {
    if (overlay._a11yTrapHandler) {
      overlay.removeEventListener("keydown", overlay._a11yTrapHandler);
      overlay._a11yTrapHandler = null;
    }

    const anyStillOpen = OVERLAY_IDS.some(id => {
      const el = document.getElementById(id);
      return el && !el.classList.contains("hidden");
    });
    if (!anyStillOpen) {
      const main = document.getElementById("mainView");
      if (main) main.removeAttribute("aria-hidden");
    }

    const toRefocus = lastFocusedByOverlay.get(overlay.id);
    lastFocusedByOverlay.delete(overlay.id);
    if (toRefocus && typeof toRefocus.focus === "function" && document.body.contains(toRefocus)) {
      toRefocus.focus({ preventScroll: true });
    }
  }

  OVERLAY_IDS.forEach(id => {
    const overlay = document.getElementById(id);
    if (!overlay) return; // فحص دفاعي: غياب نافذة معينة لا يكسر الباقي

    let wasHidden = overlay.classList.contains("hidden");
    const observer = new MutationObserver(() => {
      const isHidden = overlay.classList.contains("hidden");
      if (isHidden === wasHidden) return;
      wasHidden = isHidden;
      if (isHidden) onOverlayClosed(overlay);
      else onOverlayOpened(overlay);
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ["class"] });
  });

  // Escape يُغلق أي نافذة مفتوحة حاليًا — عام لكل النوافذ الست دفعة
  // واحدة، بدل معالج app.js القديم المحصور فـ auth/onboarding فقط.
  // يُستدعى زر الإغلاق الحقيقي للنافذة (بدل classList.add("hidden")
  // مباشرة) حتى تُنفَّذ أي منطق تنظيف إضافي قد تقوم به دالة close()
  // الخاصة بتلك النافذة (مثال: renderWorkspaceBody لا شيء خاص هنا،
  // لكن هذا يبقيه صحيحًا حتى لو أُضيف لاحقًا).
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    OVERLAY_IDS.forEach(id => {
      const overlay = document.getElementById(id);
      if (!overlay || overlay.classList.contains("hidden")) return;
      const closeTrigger = findCloseTrigger(overlay);
      if (closeTrigger) closeTrigger.click();
      else overlay.classList.add("hidden");
    });
  });
})();
