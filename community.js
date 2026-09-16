// ===================================================================
// معرض المجتمع (Community Showcase)
// ===================================================================
// يعتمد على نفس عميل Supabase المُعرَّف فـ auth-sync.js. بما أن كل
// السكربتات هنا كلاسيكية (بلا type="module") ومُحمَّلة فـ نفس الصفحة،
// فهي تتشارك نفس النطاق المعجمي العلوي: يمكن لهذا الملف قراءة
// SYNC_ENABLED و supabaseClient و currentUser مباشرة، بلا تمريرها عبر
// window (نفس النمط المُستعمل أصلاً فـ project-workspace.js مع دوال
// app.js). auth-sync.js يجب أن يُحمَّل قبل هذا الملف (وهو كذلك أصلًا
// فـ index.html).
//
// جدول Supabase المطلوب (شغّل هاد SQL مرة وحدة فـ SQL editor):
//
//   create table if not exists public.community_projects (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid not null,
//     track_id text not null,
//     track_title text not null,
//     category_name text not null,
//     description text,
//     link text,
//     created_at timestamptz not null default now()
//   );
//   alter table public.community_projects enable row level security;
//   create policy "anyone can read community projects"
//     on public.community_projects for select using (true);
//   create policy "users can insert their own project"
//     on public.community_projects for insert with check (auth.uid() = user_id);
//
// بصدق: بلا SYNC_ENABLED (بلا مفاتيح Supabase حقيقية فـ auth-sync.js)
// أو بلا هذا الجدول، القسم كيختفي بهدوء أو يعرض رسالة توضيحية حقيقية
// (communityEmpty)، بدل "قريبًا" وهمية أو كسر الصفحة.
//
// ===================================================================
// §43: تعليقات/نقاش حول كل مشروع مُشارَك (Community discussion)
// ===================================================================
// كان معرض المجتمع عرضًا بحتًا (Project → Share) بلا أي حلقة تفاعل
// (→ Feedback → Discussion) كما يطلبها القسم 43. هذا يضيف طبقة تعليقات
// خفيفة فوق نفس نمط الأمانة المتّبع فـ باقي الملف: بلا SYNC_ENABLED أو
// بلا الجدول التالي، زر "التعليقات" ببساطة يختفي (لا "قريبًا" وهمية).
//
// جدول Supabase إضافي مطلوب (شغّل هاد SQL مرة وحدة فـ SQL editor، بجانب
// جدول community_projects أعلاه):
//
//   create table if not exists public.community_comments (
//     id uuid primary key default gen_random_uuid(),
//     project_id uuid not null references public.community_projects(id) on delete cascade,
//     user_id uuid not null,
//     body text not null,
//     created_at timestamptz not null default now()
//   );
//   alter table public.community_comments enable row level security;
//   create policy "anyone can read comments"
//     on public.community_comments for select using (true);
//   create policy "signed-in users can post their own comment"
//     on public.community_comments for insert with check (auth.uid() = user_id);
//
// تصميم عمدي: التعليقات تُحمَّل فقط عند الضغط على "أظهر التعليقات" لكل
// بطاقة (بدل جلبها كلها دفعة واحدة عند رسم المعرض)، لتفادي N+1 نداء
// شبكي غير ضروري لكل زائر لم يهتم أصلًا بفتح أي نقاش — نفس فلسفة
// "أظهر تلميحًا" الموجودة أصلاً فـ project-workspace.js. لا يوجد أي
// إشراف/فلترة آلية على المحتوى (بصدق: هذا تطبيق محلي بلا خادم اعتدال)،
// فالتعليقات تُعرض كما هي مع تنويه واضح بهذا فـ الواجهة.
// ===================================================================

const COMMUNITY_MAX_ITEMS = 12;
const COMMUNITY_MAX_COMMENTS = 50;

async function fetchCommunityProjects() {
  if (!SYNC_ENABLED || !supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("community_projects")
      .select("id, track_title, category_name, description, link, created_at")
      .order("created_at", { ascending: false })
      .limit(COMMUNITY_MAX_ITEMS);
    if (error) return null;
    return data || [];
  } catch (e) {
    return null; // الجدول ربما غير معدّ بعد، أو مشكل شبكة — لا نكسر الصفحة
  }
}

async function fetchCommentsForProject(projectId) {
  if (!SYNC_ENABLED || !supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("community_comments")
      .select("id, body, created_at, user_id")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
      .limit(COMMUNITY_MAX_COMMENTS);
    if (error) return null;
    return data || [];
  } catch (e) {
    return null; // الجدول ربما غير موجود بعد، أو مشكل شبكة — لا نكسر البطاقة
  }
}

async function submitCommunityComment(projectId, bodyText) {
  if (!SYNC_ENABLED || !supabaseClient || !currentUser) {
    showToast(t("communitySignInRequired"));
    return null;
  }
  const trimmed = (bodyText || "").trim().slice(0, 500);
  if (!trimmed) return null;
  try {
    const { data, error } = await supabaseClient
      .from("community_comments")
      .insert({ project_id: projectId, user_id: currentUser.id, body: trimmed })
      .select("id, body, created_at, user_id")
      .single();
    if (error) {
      showToast(t("communityCommentError"));
      return null;
    }
    return data;
  } catch (e) {
    showToast(t("communityCommentError"));
    return null;
  }
}

function buildCommentRow(comment) {
  return el("div", { class: "community-comment-row" }, [
    el("span", { class: "community-comment-body", text: comment.body }),
    el("span", { class: "community-comment-date", text: new Date(comment.created_at).toLocaleDateString(currentLang) })
  ]);
}

// يبني قسم التعليقات لبطاقة مشروع واحدة: مخفي افتراضيًا خلف زر (نفس
// نمط "أظهر تلميحًا")، ويُحمَّل من الخادم فقط عند أول ضغطة على الزر.
function buildCommentsSection(item) {
  if (!SYNC_ENABLED) return null; // بلا مزامنة، لا معنى لعرض زر لا يفعل شيئًا

  const commentsList = el("div", { class: "community-comments-list hidden" });
  const disclaimer = el("p", { class: "mastery-hint community-comments-disclaimer hidden", text: t("communityCommentsDisclaimer") });
  let loaded = false;

  const revealBtn = el("button", {
    type: "button",
    class: "btn-back community-comments-toggle",
    text: t("communityShowComments"),
    onclick: async () => {
      const willShow = commentsList.classList.contains("hidden");
      if (willShow && !loaded) {
        loaded = true;
        commentsList.replaceChildren(el("span", { class: "mastery-hint", text: t("communityCommentsLoading") }));
        commentsList.classList.remove("hidden");
        disclaimer.classList.remove("hidden");
        revealBtn.textContent = t("communityHideComments");
        const comments = await fetchCommentsForProject(item.id);
        commentsList.replaceChildren();
        if (comments === null) {
          commentsList.appendChild(el("p", { class: "mastery-hint", text: t("communityCommentsEmpty") }));
        } else {
          if (!comments.length) {
            commentsList.appendChild(el("p", { class: "community-comments-empty-note mastery-hint", text: t("communityCommentsEmpty") }));
          } else {
            comments.forEach(c => commentsList.appendChild(buildCommentRow(c)));
          }
          commentsList.appendChild(buildCommentForm(item.id, commentsList));
        }
        return;
      }
      commentsList.classList.toggle("hidden");
      disclaimer.classList.toggle("hidden");
      revealBtn.textContent = commentsList.classList.contains("hidden") ? t("communityShowComments") : t("communityHideComments");
    }
  });

  return el("div", { class: "community-comments-section" }, [revealBtn, disclaimer, commentsList]);
}

function buildCommentForm(projectId, listEl) {
  if (!currentUser) {
    return el("p", { class: "mastery-hint community-comment-signin-note", text: t("communityCommentSignInRequired") });
  }
  const textarea = el("textarea", {
    class: "practice-input community-comment-input",
    placeholder: t("communityCommentPlaceholder")
  });
  const submitBtn = el("button", {
    type: "button",
    class: "btn-primary community-comment-submit",
    text: t("communityCommentSubmit"),
    onclick: async () => {
      const value = textarea.value.trim();
      if (!value) return;
      submitBtn.disabled = true;
      const saved = await submitCommunityComment(projectId, value);
      submitBtn.disabled = false;
      if (saved) {
        textarea.value = "";
        const emptyNote = listEl.querySelector(".community-comments-empty-note");
        if (emptyNote) emptyNote.remove();
        listEl.insertBefore(buildCommentRow(saved), listEl.lastChild);
      }
    }
  });
  return el("div", { class: "community-comment-form" }, [textarea, submitBtn]);
}

function buildCommunityCard(item) {
  const children = [
    el("div", { class: "community-card-header" }, [
      el("strong", { class: "community-card-track", text: item.track_title }),
      el("span", { class: "community-card-category", text: item.category_name })
    ])
  ];
  if (item.description) {
    children.push(el("p", { class: "community-card-desc", text: item.description }));
  }
  const safeLink = typeof window.masarSafeExternalUrl === "function" ? window.masarSafeExternalUrl(item.link) : "";
  if (safeLink) {
    children.push(el("a", {
      class: "resource-link community-card-link",
      href: safeLink,
      target: "_blank",
      rel: "noopener noreferrer"
    }, [el("span", { "aria-hidden": "true", class: "resource-icon", text: "↗" }), safeLink]));
  }
  const commentsSection = buildCommentsSection(item);
  if (commentsSection) children.push(commentsSection);
  return el("div", { class: "community-card" }, children);
}

// تُستدعى دفاعيًا من renderDashboard فـ app.js (فحص typeof قبل النداء).
window.masarRenderCommunity = async function () {
  const section = document.getElementById("communitySection");
  const feed = document.getElementById("communityFeed");
  const introEl = document.getElementById("communityIntro");
  const titleEl = document.getElementById("communityTitle");
  if (!section || !feed) return;

  if (!SYNC_ENABLED) {
    // بصدق: بلا Supabase مُعدّ فعليًا، لا نعرض قسمًا فارغًا أو وهميًا.
    section.classList.add("hidden");
    return;
  }

  if (titleEl) titleEl.textContent = t("communityTitle");
  if (introEl) introEl.textContent = t("communityIntro");
  feed.replaceChildren(el("p", { class: "mastery-hint", text: t("communityEmpty") }));
  section.classList.remove("hidden");

  const projects = await fetchCommunityProjects();
  if (!projects) return; // نبقى على رسالة الفراغ الصادقة (جدول غير موجود بعد، أو شبكة)
  feed.replaceChildren();
  if (!projects.length) {
    feed.appendChild(el("p", { class: "mastery-hint", text: t("communityEmpty") }));
    return;
  }
  projects.forEach(item => feed.appendChild(buildCommunityCard(item)));
};

// تُستدعى من project-workspace.js عند الضغط على "شارك مع المجتمع".
// ترجع true فقط عند نجاح حقيقي على الخادم، حتى لا يُعلَّم المشروع
// كـ"مُشارَك" محليًا بينما فشلت العملية فعليًا.
window.masarShareProjectToCommunity = async function (categoryId, trackId, track, submission) {
  if (!SYNC_ENABLED || !supabaseClient || !currentUser) {
    showToast(t("communitySignInRequired"));
    return false;
  }
  const category = SKILL_DATA.find(c => c.id === categoryId);
  try {
    const { error } = await supabaseClient.from("community_projects").insert({
      user_id: currentUser.id,
      track_id: trackId,
      track_title: tr(track.title),
      category_name: category ? tr(category.name) : "",
      description: (submission.description || "").slice(0, 500),
      link: submission.link || null
    });
    if (error) {
      showToast(t("communityShareError"));
      return false;
    }
    showToast(t("communityShareSuccess"));
    if (typeof window.masarRenderCommunity === "function") window.masarRenderCommunity();
    return true;
  } catch (e) {
    showToast(t("communityShareError"));
    return false;
  }
};
