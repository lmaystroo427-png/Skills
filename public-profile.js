// ===================================================================
// الملف الشخصي العام (Public Profile)
// ===================================================================
// يعتمد على نفس عميل Supabase المُعرَّف فـ auth-sync.js (SYNC_ENABLED,
// supabaseClient, currentUser)، بنفس نمط community.js: كل السكربتات
// كلاسيكية (بلا type="module") فتتشارك نفس النطاق العلوي.
//
// جدول Supabase المطلوب (شغّل هاد SQL مرة وحدة فـ SQL editor):
//
//   create table if not exists public.public_profiles (
//     user_id uuid primary key,
//     is_public boolean not null default false,
//     snapshot jsonb,
//     updated_at timestamptz not null default now()
//   );
//   alter table public.public_profiles enable row level security;
//   create policy "public rows are readable"
//     on public.public_profiles for select using (is_public = true);
//   create policy "owner can read own row"
//     on public.public_profiles for select using (auth.uid() = user_id);
//   create policy "owner can upsert own row"
//     on public.public_profiles for insert with check (auth.uid() = user_id);
//   create policy "owner can update own row"
//     on public.public_profiles for update using (auth.uid() = user_id);
//
// خصوصية بالتصميم: الـ snapshot المخزّن لا يحتوي البريد الإلكتروني ولا
// أي ملاحظات تطبيق نصية حرة (practice notes) — فقط عناوين المهارات
// المُنجزة ونسبها، والمشاريع المُسلَّمة (عنوان + رابط + وصف قصير
// مقصوص)، والستريك. المستخدم يبقى خاصًا افتراضيًا (is_public = false)
// حتى يُفعِّل هو بنفسه.
// ===================================================================

function buildPublicSnapshot() {
  const summary = computeProgressSummary();
  const skills = [];
  SKILL_DATA.forEach(category => {
    category.tracks.forEach(track => {
      const mastery = computeTrackMastery(category.id, track.id, track);
      if (mastery && mastery.doneCount > 0) {
        skills.push({ title: tr(track.title), category: tr(category.name), pct: mastery.overallPct });
      }
    });
  });
  skills.sort((a, b) => b.pct - a.pct);

  const projects = [];
  if (typeof window.masarGetProjectSubmission === "function") {
    SKILL_DATA.forEach(category => {
      category.tracks.forEach(track => {
        const submission = window.masarGetProjectSubmission(track.id);
        if (submission && submission.submittedAt) {
          projects.push({
            title: tr(track.title),
            category: tr(category.name),
            link: submission.link || null,
            description: (submission.description || "").slice(0, 300)
          });
        }
      });
    });
  }

  return {
    totalDone: summary.totalDone,
    booksFinished: summary.booksFinished,
    streak: currentStreak.count,
    skills: skills.slice(0, 20),
    projects: projects.slice(0, 20)
  };
}

// ---------- إعدادات الملف الشخصي (المستخدم صاحب الحساب) ----------
async function renderPublicProfileSettings() {
  const body = document.getElementById("publicProfileBody");
  const titleEl = document.getElementById("publicProfileTitle");
  if (!body) return;
  if (titleEl) titleEl.textContent = t("publicProfileTitle");
  body.replaceChildren();

  if (!SYNC_ENABLED) {
    body.appendChild(el("p", { class: "mastery-hint", text: t("publicProfileNotConfigured") }));
    return;
  }
  if (!currentUser) {
    body.appendChild(el("p", { class: "mastery-hint", text: t("publicProfileSignInRequired") }));
    return;
  }

  let row = null;
  try {
    const { data } = await supabaseClient
      .from("public_profiles")
      .select("is_public")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    row = data;
  } catch (e) {
    // الصف قد لا يوجد بعد (أول استعمال) — نتعامل معه كخاص افتراضيًا.
  }

  const isPublic = !!(row && row.is_public);
  const statusText = el("p", { class: "mastery-hint", text: isPublic ? t("publicProfileEnabled") : t("publicProfileDisabled") });

  const checkbox = el("input", { type: "checkbox", id: "publicProfileToggle", class: "challenge-checkbox" });
  if (isPublic) checkbox.checked = true;
  const toggleLabel = el("label", { for: "publicProfileToggle", class: "challenge-checklist-label" }, [
    checkbox, el("span", { text: t("publicProfileToggleLabel") })
  ]);

  const shareUrl = `${window.location.origin}${window.location.pathname}#profile-${currentUser.id}`;
  const linkWrap = el("div", { class: "workspace-actions" });
  if (isPublic) {
    linkWrap.appendChild(el("button", {
      type: "button",
      class: "btn-back",
      text: t("publicProfileCopyLink"),
      onclick: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          showToast(t("publicProfileLinkCopied"));
        } catch (e) {
          showToast(shareUrl);
        }
      }
    }));
  }

  checkbox.addEventListener("change", async e => {
    const nextPublic = e.target.checked;
    checkbox.disabled = true;
    try {
      const snapshot = buildPublicSnapshot();
      const { error } = await supabaseClient.from("public_profiles").upsert({
        user_id: currentUser.id,
        is_public: nextPublic,
        snapshot,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      renderPublicProfileSettings();
    } catch (err) {
      checkbox.checked = !nextPublic;
      showToast(t("communityShareError"));
    } finally {
      checkbox.disabled = false;
    }
  });

  body.appendChild(statusText);
  body.appendChild(toggleLabel);
  if (linkWrap.children.length) body.appendChild(linkWrap);
}

function openPublicProfileSettings() {
  document.getElementById("publicProfileOverlay").classList.remove("hidden");
  renderPublicProfileSettings();
}
function closePublicProfileSettings() {
  document.getElementById("publicProfileOverlay").classList.add("hidden");
}
document.getElementById("publicProfileBtn").addEventListener("click", openPublicProfileSettings);
document.getElementById("publicProfileCloseBtn").addEventListener("click", closePublicProfileSettings);
document.getElementById("publicProfileOverlay").addEventListener("click", e => {
  if (e.target.id === "publicProfileOverlay") closePublicProfileSettings();
});

// ---------- عرض ملف عام لزائر (عبر رابط #profile-<userId>) ----------
function buildPublicProfileView(snapshot) {
  const stats = el("div", { class: "hero-stats" }, [
    el("div", { class: "stat-card" }, [
      el("div", { class: "stat-num", text: String(snapshot.totalDone || 0) }),
      el("div", { class: "stat-label", text: t("statCompletedLabel") })
    ]),
    el("div", { class: "stat-card" }, [
      el("div", { class: "stat-num", text: String(snapshot.booksFinished || 0) }),
      el("div", { class: "stat-label", text: t("statFinishedLabel") })
    ]),
    el("div", { class: "stat-card" }, [
      el("div", { class: "stat-num", text: String(snapshot.streak || 0) }),
      el("div", { class: "stat-label", text: t("streakLabel") })
    ])
  ]);

  const skillsList = el("div", { class: "portfolio-skills-list" });
  (snapshot.skills || []).forEach(s => {
    const fill = el("div", { class: "portfolio-skill-fill" });
    fill.style.width = s.pct + "%";
    skillsList.appendChild(el("div", { class: "portfolio-skill-row" }, [
      el("span", { class: "portfolio-skill-name", text: `${s.title} — ${s.category}` }),
      el("div", { class: "portfolio-skill-bar" }, [fill]),
      el("span", { class: "portfolio-skill-pct", text: s.pct + "%" })
    ]));
  });

  const projectsList = el("div", { class: "community-feed" });
  (snapshot.projects || []).forEach(p => {
    const parts = [
      el("div", { class: "community-card-header" }, [
        el("strong", { class: "community-card-track", text: p.title }),
        el("span", { class: "community-card-category", text: p.category })
      ])
    ];
    if (p.description) parts.push(el("p", { class: "community-card-desc", text: p.description }));
    const safeLink = typeof window.masarSafeExternalUrl === "function" ? window.masarSafeExternalUrl(p.link) : "";
    if (safeLink) {
      parts.push(el("a", {
        class: "resource-link community-card-link",
        href: safeLink, target: "_blank", rel: "noopener noreferrer"
      }, [el("span", { "aria-hidden": "true", class: "resource-icon", text: "↗" }), safeLink]));
    }
    projectsList.appendChild(el("div", { class: "community-card" }, parts));
  });

  return el("div", { class: "public-profile-content" }, [
    stats,
    el("h2", { class: "achievements-title", text: t("portfolioTitle") }),
    skillsList.children.length ? skillsList : el("p", { class: "mastery-hint", text: t("projectLibraryEmpty") }),
    el("h2", { class: "achievements-title", text: t("projectLibraryTitle") }),
    projectsList.children.length ? projectsList : el("p", { class: "mastery-hint", text: t("projectLibraryEmpty") })
  ]);
}

function ensurePublicProfilePageEl() {
  let page = document.getElementById("publicProfilePage");
  if (!page) {
    page = el("section", { id: "publicProfilePage", class: "view hidden" });
    document.getElementById("mainView").appendChild(page);
  }
  return page;
}

async function showPublicProfilePage(targetUserId) {
  document.getElementById("dashboardView").classList.add("hidden");
  document.getElementById("trackView").classList.add("hidden");
  const page = ensurePublicProfilePageEl();
  page.classList.remove("hidden");
  page.replaceChildren();

  page.appendChild(el("button", {
    type: "button",
    class: "btn-back",
    text: t("publicProfileBackToApp"),
    onclick: () => {
      history.replaceState({ view: "dashboard" }, "", window.location.pathname);
      page.classList.add("hidden");
      document.getElementById("dashboardView").classList.remove("hidden");
      renderAll();
    }
  }));

  if (!SYNC_ENABLED) {
    page.appendChild(el("p", { class: "mastery-hint", text: t("publicProfileNotConfigured") }));
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("public_profiles")
      .select("is_public, snapshot")
      .eq("user_id", targetUserId)
      .maybeSingle();
    if (error || !data || !data.is_public) {
      page.appendChild(el("p", { class: "mastery-hint", text: t("publicProfileNotFound") }));
      return;
    }
    page.appendChild(el("h1", { text: t("publicProfileTitle") }));
    page.appendChild(buildPublicProfileView(data.snapshot || {}));
  } catch (e) {
    page.appendChild(el("p", { class: "mastery-hint", text: t("publicProfileNotFound") }));
  }
}

// عند تحميل الصفحة: إذا كان الهاش يشير لملف عام (#profile-<userId>)،
// نعرض صفحة العرض العامة فوق أي شيء بدأه app.js (لوحة القيادة أو
// مسار من LAST_VIEW_KEY)، بلا الحاجة لتعديل app.js نفسه.
(function initPublicProfileFromHash() {
  const prefix = "#profile-";
  if (!window.location.hash.startsWith(prefix)) return;
  const targetUserId = window.location.hash.slice(prefix.length);
  if (targetUserId) showPublicProfilePage(targetUserId);
})();
