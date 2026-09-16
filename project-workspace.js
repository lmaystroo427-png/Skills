// ===================================================================
// مساحة عمل المشروع + مكتبة المشاريع (Project Workspace & Library)
// ===================================================================
// يبني فوق buildProjectModel الموجودة أصلاً فـ app.js (المتطلبات/rubric
// الذاتي)، ويضيف الجزء الناقص: مكان حقيقي يكتب/يحفظ فيه المستخدم ما
// أنجزه فعليًا (وصف + رابط + قائمة تحقق قابلة للتأشير)، بدل لوحة تقدير
// نظري بلا أي أثر فعلي. هذا "تسليم" محلي (بلا خادم تصحيح حقيقي) — بصدق،
// بلا ادعاء أي تقييم آلي للجودة، تمامًا كما التزم renderProjectPanel
// أصلاً (projectEvaluationDisclaimer).
// ===================================================================

// PROJECT_SUBMISSION_KEY منقول إلى js/core/constants.js (يُحمَّل قبل هذا
// الملف). الشكل: { [trackId]: { link, description, checklist: {idx: bool}, submittedAt, sharedToCommunity } }

function normalizeExternalUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.href;
  } catch (e) {
    return "";
  }
}

window.masarSafeExternalUrl = normalizeExternalUrl;

function loadProjectSubmissions() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROJECT_SUBMISSION_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function saveProjectSubmission(trackId, data) {
  const state = loadProjectSubmissions();
  state[trackId] = { ...(state[trackId] || {}), ...data };
  try {
    localStorage.setItem(PROJECT_SUBMISSION_KEY, JSON.stringify(state));
  } catch (e) {
    // فشل حفظ مشروع واحد لا يجب أن يوقف التطبيق.
  }
  return state[trackId];
}

window.masarGetProjectSubmission = function (trackId) {
  return loadProjectSubmissions()[trackId] || null;
};

function renderWorkspaceBody(categoryId, trackId, track, project) {
  const body = document.getElementById("workspaceBody");
  const existing = window.masarGetProjectSubmission(trackId) || { checklist: {} };
  existing.checklist = existing.checklist && typeof existing.checklist === "object" && !Array.isArray(existing.checklist)
    ? { ...existing.checklist } : {};
  // Migrate the old index-based checklist once. Requirement IDs are stable so
  // reordering/editing project requirements cannot silently move a user's checkmarks.
  if (existing.checklist["0"] !== undefined && existing.checklist["project-lessons"] === undefined) {
    existing.checklist["project-lessons"] = !!existing.checklist["0"];
    delete existing.checklist["0"];
  }
  if (existing.checklist["1"] !== undefined && existing.checklist["project-constraints"] === undefined) {
    existing.checklist["project-constraints"] = !!existing.checklist["1"];
    delete existing.checklist["1"];
  }
  body.replaceChildren();

  body.appendChild(el("p", { class: "mastery-hint", text: t("workspaceIntro") }));
  body.appendChild(el("p", { class: "panel-lead", text: project.objective }));

  // موارد وتلميحات المشروع (§11)، مبنية على نفس project.hints/resources
  // القادمة من buildProjectModel — لا تكرار للمنطق، فقط عرض إضافي هنا
  // حيث يقضي المستخدم وقت العمل الفعلي على المشروع.
  if (project.resources && project.resources.length) {
    body.appendChild(el("div", { class: "lesson-resources" }, project.resources.map(resource => el("a", {
      class: "resource-link",
      href: resource.url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, [el("span", { "aria-hidden": "true", class: "resource-icon", text: "↗" }), resource.label]))));
  }
  if (project.hints && project.hints.length) {
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
    body.appendChild(el("div", { class: "project-hints" }, [revealBtn, hintsList]));
  }

  const checklistTitle = el("strong", { class: "workspace-section-title", text: t("workspaceChecklistTitle") });
  const checklist = el("div", { class: "challenge-checklist" });
  project.requirements.forEach(item => {
    const checked = !!existing.checklist[item.id];
    const checkbox = el("input", {
      type: "checkbox",
      id: `workspace-item-${trackId}-${item.id}`,
      class: "challenge-checkbox"
    });
    if (checked) checkbox.checked = true;
    checkbox.addEventListener("change", e => {
      existing.checklist[item.id] = e.target.checked;
      saveProjectSubmission(trackId, { checklist: existing.checklist });
    });
    checklist.appendChild(el("div", { class: "challenge-checklist-item" + (checked ? " done" : "") }, [
      el("label", { for: `workspace-item-${trackId}-${item.id}`, class: "challenge-checklist-label" }, [checkbox, el("span", { text: item.text })])
    ]));
  });

  const linkInput = el("input", {
    type: "url",
    class: "auth-input",
    placeholder: "https://...",
    value: existing.link || ""
  });
  const descInput = el("textarea", {
    class: "practice-input",
    style: "min-height:90px",
    placeholder: t("workspaceDescLabel")
  });
  descInput.value = existing.description || "";

  const statusLine = existing.submittedAt
    ? el("p", { class: "practice-saved-note", text: t("workspaceSubmittedOn", { date: new Date(existing.submittedAt).toLocaleDateString(currentLang) }) })
    : null;

  const submitBtn = el("button", {
    type: "button",
    class: "btn-primary",
    text: existing.submittedAt ? t("workspaceEditBtn") : t("workspaceSubmitBtn"),
    onclick: () => {
      const safeLink = normalizeExternalUrl(linkInput.value);
      if (linkInput.value.trim() && !safeLink) {
        showToast(t("workspaceInvalidLink"));
        linkInput.focus();
        return;
      }
      const lessonsComplete = countDone(categoryId, trackId, track.lessons) === track.lessons.length;
      if (!lessonsComplete) {
        showToast(t("workspaceFinishLessonsFirst"));
        return;
      }
      const allRequirementsDone = project.requirements.every(item => !!existing.checklist[item.id]);
      if (!allRequirementsDone) {
        showToast(t("workspaceCompleteChecklistFirst"));
        return;
      }
      saveProjectSubmission(trackId, {
        link: safeLink,
        description: descInput.value.trim(),
        submittedAt: existing.submittedAt || Date.now()
      });
      trackEvent("project_completed", { trackId });
      // §32: نفس الحساب (computeProgressSummary) بلا حاجة لاستدعائه مرتين
      // منفصلتين لنفس النقرة — نتيجة واحدة تكفي للاستعمالين.
      const summary = computeProgressSummary();
      checkNewAchievements(summary, currentStreak);
      renderWorkspaceBody(categoryId, trackId, track, project);
      if (typeof window.masarRenderProjectLibrary === "function") window.masarRenderProjectLibrary(summary);
      showToast(t("workspaceSubmitBtn"));
    }
  });

  const shareBtn = (existing.submittedAt && typeof window.masarShareProjectToCommunity === "function")
    ? el("button", {
        type: "button",
        class: "btn-back",
        text: existing.sharedToCommunity ? t("workspaceSharedAlready") : t("workspaceShareCommunityBtn"),
        disabled: !!existing.sharedToCommunity,
        onclick: async () => {
          const ok = await window.masarShareProjectToCommunity(categoryId, trackId, track, existing);
          if (ok) {
            saveProjectSubmission(trackId, { sharedToCommunity: true });
            renderWorkspaceBody(categoryId, trackId, track, project);
          }
        }
      })
    : null;

  body.appendChild(checklistTitle);
  body.appendChild(checklist);
  body.appendChild(el("label", { class: "practice-label", text: t("workspaceLinkLabel") }));
  body.appendChild(linkInput);
  body.appendChild(el("label", { class: "practice-label", text: t("workspaceDescLabel") }));
  body.appendChild(descInput);
  if (statusLine) body.appendChild(statusLine);
  const actions = el("div", { class: "workspace-actions" }, [submitBtn, shareBtn].filter(Boolean));
  body.appendChild(actions);
}

window.masarOpenProjectWorkspace = function (categoryId, trackId, track) {
  const project = buildProjectModel(categoryId, trackId, track);
  document.getElementById("workspaceTitle").textContent = `${t("projectTitle")} — ${tr(track.title)}`;
  renderWorkspaceBody(categoryId, trackId, track, project);
  document.getElementById("projectWorkspaceOverlay").classList.remove("hidden");
};

function closeProjectWorkspace() {
  document.getElementById("projectWorkspaceOverlay").classList.add("hidden");
}
document.getElementById("workspaceCloseBtn").addEventListener("click", closeProjectWorkspace);
document.getElementById("projectWorkspaceOverlay").addEventListener("click", e => {
  if (e.target.id === "projectWorkspaceOverlay") closeProjectWorkspace();
});

// ===================================================================
// مكتبة المشاريع — كل المسارات التي بدأ فيها المستخدم على الأقل درسًا
// واحدًا، مع حالة إنجاز المشروع الحقيقي (مُقفَل / جاهز / مُنجَز).
// ===================================================================
window.masarRenderProjectLibrary = function (summary) {
  const section = document.getElementById("projectLibrarySection");
  const grid = document.getElementById("projectLibraryGrid");
  if (!section || !grid) return;

  const titleEl = document.getElementById("projectLibraryTitle");
  if (titleEl) titleEl.textContent = t("projectLibraryTitle");

  const entries = [];
  SKILL_DATA.forEach(category => {
    category.tracks.forEach(track => {
      const info = summary.perTrack.get(`${category.id}::${track.id}`);
      if (!info || info.done === 0) return; // نعرض فقط المسارات التي بدأها المستخدم فعلًا
      const submission = window.masarGetProjectSubmission(track.id);
      const status = submission && submission.submittedAt
        ? "submitted"
        : (info.done === info.total ? "ready" : "locked");
      entries.push({ category, track, info, submission, status });
    });
  });

  grid.replaceChildren();
  if (!entries.length) {
    grid.appendChild(el("p", { class: "mastery-hint", text: t("projectLibraryEmpty") }));
    section.classList.remove("hidden");
    return;
  }

  entries.sort((a, b) => (b.status === "submitted") - (a.status === "submitted"));
  entries.forEach(({ category, track, status }) => {
    const statusKey = status === "submitted" ? "projectLibraryStatusSubmitted" : (status === "ready" ? "projectLibraryStatusReady" : "projectLibraryStatusLocked");
    const card = el("button", {
      type: "button",
      class: "project-library-card project-library-status-" + status,
      onclick: () => openTrack(category.id, track.id)
    }, [
      el("strong", { class: "project-library-track", text: tr(track.title) }),
      el("span", { class: "project-library-category", text: tr(category.name) }),
      el("span", { class: "project-library-status-badge", text: t(statusKey) })
    ]);
    grid.appendChild(card);
  });

  section.classList.remove("hidden");
};
