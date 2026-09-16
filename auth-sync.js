// ===================================================================
// حسابات المستخدمين ومزامنة التقدم عبر Supabase
// ===================================================================
// خاصك تبدّل هاد القيمتين بلي ديالك (Project Settings → API فـ Supabase).
// بلا ما تبدلهم، هاد الملف كيبقى معطّل بأمان وما كيأثرش على باقي الموقع.
const SUPABASE_URL = "https://riwskoyckuuvkvwxxywj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_G-A82-SGESgDGOC9vgDuTw_E3OVvjmt";

const SYNC_ENABLED = !SUPABASE_URL.includes("YOUR-PROJECT");
let supabaseClient = null;
let currentUser = null;
let isApplyingRemoteState = false;
let pushTimer = null;

if (SYNC_ENABLED && window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ===================================================================
// دفع/سحب التقدم من جدول "progress" فـ Supabase
// السطر updated_at كيُستعمل لتحديد أي نسخة أحدث (محلية أو بعيدة) عند
// أول تسجيل دخول، تفاديًا لسحق تقدم محلي أحدث بنسخة بعيدة أقدم.
// ===================================================================
async function pullRemoteProgress() {
  if (!supabaseClient || !currentUser) return;
  const { data, error } = await supabaseClient
    .from("progress")
    .select("state, updated_at")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error || !data) return;

  const localUpdatedAt = Math.max(0, ...Object.values(progressRepository.state.tracks || {}).map(tr => tr.updatedAt || 0));
  const remoteUpdatedAt = new Date(data.updated_at).getTime();

  if (remoteUpdatedAt > localUpdatedAt && isValidProgressState(data.state)) {
    isApplyingRemoteState = true;
    progressRepository.state = data.state;
    persistProgressState(progressRepository.state);
    isApplyingRemoteState = false;
    renderAll();
    if (currentTrackRef) renderLessonList(currentTrackRef.categoryId, currentTrackRef.trackId);
  } else {
    pushLocalProgress();
  }
}

async function pushLocalProgress() {
  if (!supabaseClient || !currentUser) return;
  await supabaseClient.from("progress").upsert({
    user_id: currentUser.id,
    state: progressRepository.state,
    updated_at: new Date().toISOString()
  });
}

document.addEventListener("masar:progressSaved", () => {
  if (!currentUser || isApplyingRemoteState) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(pushLocalProgress, 800); // تجميع الحفظات المتتالية بدل دفع كل نقرة على حدة
});

// ===================================================================
// أصوات "المفيد" المجتمعية (Community helpful votes)
// تتطلب جدولًا بسيطًا فـ Supabase (شغّل هاد SQL مرة وحدة فـ SQL editor):
//
//   create table if not exists public.lesson_helpful (
//     lesson_id text primary key,
//     vote_count integer not null default 0
//   );
//   alter table public.lesson_helpful enable row level security;
//   create policy "anyone can read helpful counts"
//     on public.lesson_helpful for select using (true);
//   create policy "anyone can increment helpful counts"
//     on public.lesson_helpful for insert with check (true);
//   create policy "anyone can update helpful counts"
//     on public.lesson_helpful for update using (true);
//
// بلا هاد الجدول، الدالة تفشل بصمت وتبقى الأصوات محلية فقط (كل مستخدم
// كايشوف الصوت ديالو هو بارك، بلا عدّاد مشترك).
// ===================================================================
window.masarSubmitHelpfulVote = async function (lessonId) {
  if (!supabaseClient) return;
  try {
    const { data: existing } = await supabaseClient
      .from("lesson_helpful")
      .select("vote_count")
      .eq("lesson_id", lessonId)
      .maybeSingle();
    const nextCount = (existing && existing.vote_count ? existing.vote_count : 0) + 1;
    await supabaseClient.from("lesson_helpful").upsert({ lesson_id: lessonId, vote_count: nextCount });
  } catch (e) {
    // الجدول ربما غير معدّ بعد فـ Supabase؛ الصوت المحلي يبقى محفوظ رغم ذلك.
  }
};

// ===================================================================
// واجهة المودال (تسجيل الدخول / إنشاء حساب / تسجيل الخروج)
// ===================================================================
function setAuthStatus(text) {
  document.getElementById("authStatusText").textContent = text;
}

function openAuthModal() {
  document.getElementById("authModalOverlay").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("authModalOverlay").classList.add("hidden");
}

function updateAccountButton() {
  const btn = document.getElementById("accountBtn");
  if (!btn) return;
  btn.title = currentUser ? currentUser.email : "Sign in / Sign up";
  btn.classList.toggle("account-signed-in", !!currentUser);
}

function updateAuthModalView() {
  const formArea = document.getElementById("authFormArea");
  const signOutBtn = document.getElementById("authSignOutBtn");
  const title = document.getElementById("authModalTitle");

  if (!SYNC_ENABLED) {
    title.textContent = "Sync not configured";
    setAuthStatus("Add your Supabase URL and key in auth-sync.js to enable accounts and cross-device sync.");
    formArea.classList.add("hidden");
    signOutBtn.classList.add("hidden");
    return;
  }

  if (currentUser) {
    title.textContent = "Account";
    setAuthStatus(`Signed in as ${currentUser.email}. Your progress syncs automatically.`);
    formArea.classList.add("hidden");
    signOutBtn.classList.remove("hidden");
  } else {
    title.textContent = "Sign in to sync your progress";
    setAuthStatus("Create a free account so your progress follows you across devices.");
    formArea.classList.remove("hidden");
    signOutBtn.classList.add("hidden");
  }
}

async function handleSignIn() {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  if (!email || !password) return;
  setAuthStatus("Signing in...");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) setAuthStatus(error.message);
}

async function handleSignUp() {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  if (!email || !password) return;
  setAuthStatus("Creating your account...");
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) setAuthStatus(error.message);
  else setAuthStatus("Check your email to confirm your account, then sign in.");
}

async function handleSignOut() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  closeAuthModal();
}

if (SYNC_ENABLED && supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session ? session.user : null;
    updateAccountButton();
    updateAuthModalView();
    if (currentUser) pullRemoteProgress();
  });
}

document.getElementById("accountBtn").addEventListener("click", () => {
  updateAuthModalView();
  openAuthModal();
});
document.getElementById("authModalClose").addEventListener("click", closeAuthModal);
document.getElementById("authModalOverlay").addEventListener("click", e => {
  if (e.target.id === "authModalOverlay") closeAuthModal();
});
document.getElementById("authSignInBtn").addEventListener("click", handleSignIn);
document.getElementById("authSignUpBtn").addEventListener("click", handleSignUp);
document.getElementById("authSignOutBtn").addEventListener("click", handleSignOut);

document.getElementById("authSignInBtn").textContent = "Sign in";
document.getElementById("authSignUpBtn").textContent = "Create account";
document.getElementById("authSignOutBtn").textContent = "Sign out";
document.getElementById("authEmail").placeholder = "Email";
document.getElementById("authPassword").placeholder = "Password";

updateAccountButton();
