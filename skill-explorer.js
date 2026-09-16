// ===================================================================
// مستكشف المهارات (Skill Explorer)
// ===================================================================
// خريطة بصرية لكل مسارات SKILL_DATA، توضح ما يؤدي إلى كل مسار
// (prerequisites، حقل موجود أصلاً فـ data.js) وما يفتحه هذا المسار
// لاحقًا (unlocks). "unlocks" ليست حقل بيانات جديد: هي ببساطة القراءة
// العكسية لنفس prerequisites، محسوبة مرة واحدة عند فتح المستكشف — بلا
// أي مخطط بيانات إضافي وبلا خطر على أي migration.
//
// يعتمد هذا الملف على دوال وعناصر موجودة أصلاً فـ app.js/translations.js:
// findTrackAnywhere, openTrack, TRACK_LEVEL_LABELS, t(), tr(), el().
// ===================================================================

function buildUnlocksMap() {
  const map = new Map(); // trackId -> [{ category, track }]
  SKILL_DATA.forEach(category => {
    category.tracks.forEach(track => {
      (track.prerequisites || []).forEach(prereqId => {
        if (!map.has(prereqId)) map.set(prereqId, []);
        map.get(prereqId).push({ category, track });
      });
    });
  });
  return map;
}

function buildExplorerCard(category, track, unlocksMap) {
  const prereqs = (track.prerequisites || [])
    .map(id => findTrackAnywhere(id))
    .filter(Boolean);
  const unlocks = unlocksMap.get(track.id) || [];

  const prereqText = prereqs.length
    ? prereqs.map(p => tr(p.track.title)).join(" • ")
    : t("explorerNoPrereq");
  const unlocksText = unlocks.length
    ? unlocks.map(u => tr(u.track.title)).join(" • ")
    : t("explorerNoUnlocks");

  const levelLabels = TRACK_LEVEL_LABELS[track.level];

  return el("button", {
    type: "button",
    class: "explorer-card",
    onclick: () => {
      document.getElementById("skillExplorerOverlay").classList.add("hidden");
      openTrack(category.id, track.id);
    }
  }, [
    el("div", { class: "explorer-card-head" }, [
      el("span", { class: `track-level level-${track.level}`, text: levelLabels[currentLang] || levelLabels.en }),
      el("strong", { class: "explorer-card-title", text: tr(track.title) })
    ]),
    el("span", { class: "explorer-card-category", text: tr(category.name) }),
    el("div", { class: "explorer-card-row" }, [
      el("span", { class: "explorer-card-label", text: t("explorerPrereqLabel") }),
      el("span", { class: "explorer-card-value", text: prereqText })
    ]),
    el("div", { class: "explorer-card-row" }, [
      el("span", { class: "explorer-card-label", text: t("explorerUnlocksLabel") }),
      el("span", { class: "explorer-card-value", text: unlocksText })
    ])
  ]);
}

function renderSkillExplorer() {
  const grid = document.getElementById("explorerGrid");
  const titleEl = document.getElementById("explorerTitle");
  const introEl = document.getElementById("explorerIntro");
  if (!grid) return;

  if (titleEl) titleEl.textContent = t("skillExplorerTitle");
  if (introEl) introEl.textContent = t("skillExplorerIntro");

  const unlocksMap = buildUnlocksMap();
  grid.replaceChildren();

  SKILL_DATA.forEach(category => {
    const block = el("div", { class: "explorer-category-block" }, [
      el("h3", { class: "explorer-category-title", text: tr(category.name) })
    ]);
    const row = el("div", { class: "explorer-cards-row" });
    category.tracks.forEach(track => row.appendChild(buildExplorerCard(category, track, unlocksMap)));
    block.appendChild(row);
    grid.appendChild(block);
  });
}

function openSkillExplorer() {
  renderSkillExplorer();
  document.getElementById("skillExplorerOverlay").classList.remove("hidden");
}

function closeSkillExplorer() {
  document.getElementById("skillExplorerOverlay").classList.add("hidden");
}

document.getElementById("skillExplorerBtn").addEventListener("click", openSkillExplorer);
document.getElementById("explorerCloseBtn").addEventListener("click", closeSkillExplorer);
document.getElementById("skillExplorerOverlay").addEventListener("click", e => {
  if (e.target.id === "skillExplorerOverlay") closeSkillExplorer();
});
