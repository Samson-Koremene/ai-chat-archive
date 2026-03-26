// Popup script — shows connection status, handles auth, and opens dashboard

const DEFAULT_DASHBOARD_URL = "http://localhost:8080/";

async function getDashboardUrl() {
  const { dashboardUrl } = await chrome.storage.local.get(["dashboardUrl"]);
  return dashboardUrl || DEFAULT_DASHBOARD_URL;
}

async function loadSettingsForm() {
  const { dashboardUrl, supabaseUrl, supabaseAnonKey } = await chrome.storage.local.get([
    "dashboardUrl",
    "supabaseUrl",
    "supabaseAnonKey",
  ]);

  const dashboardUrlEl = document.getElementById("dashboardUrl");
  const supabaseUrlEl = document.getElementById("supabaseUrl");
  const supabaseAnonKeyEl = document.getElementById("supabaseAnonKey");

  if (dashboardUrlEl) dashboardUrlEl.value = dashboardUrl || DEFAULT_DASHBOARD_URL;
  if (supabaseUrlEl) supabaseUrlEl.value = supabaseUrl || "";
  if (supabaseAnonKeyEl) supabaseAnonKeyEl.value = supabaseAnonKey || "";
}

function setSettingsMessage(kind, text) {
  const messageEl = document.getElementById("settingsMessage");
  if (!messageEl) return;
  messageEl.className = kind;
  messageEl.textContent = text;
}

// Check authentication status
async function checkAuth() {
  const { authToken, extensionKey, userEmail } = await chrome.storage.local.get([
    "authToken",
    "extensionKey",
    "userEmail",
  ]);

  if (authToken || extensionKey) {
    document.getElementById("authenticated").style.display = "block";
    document.getElementById("unauthenticated").style.display = "none";
    const label = authToken
      ? `Connected as ${userEmail || "User"}`
      : "Connected with extension key";
    document.getElementById("status").textContent = label;
    document.getElementById("status").className = "status connected";
    return true;
  } else {
    document.getElementById("authenticated").style.display = "none";
    document.getElementById("unauthenticated").style.display = "block";
    document.getElementById("status").textContent = "Not signed in";
    document.getElementById("status").className = "status disconnected";
    return false;
  }
}

// Sign in handler
document.getElementById("signInBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("authMessage");

  if (!email || !password) {
    messageEl.className = "error";
    messageEl.textContent = "Please enter email and password";
    return;
  }

  try {
    // Call Supabase auth endpoint
    const { getSupabaseUrl, getSupabaseAnonKey } = await import("../utils/api.js");
    const response = await fetch(`${getSupabaseUrl()}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": getSupabaseAnonKey(),
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      await chrome.storage.local.set({
        authToken: data.access_token,
        userEmail: email,
      });
      await chrome.storage.local.remove("extensionKey");
      messageEl.className = "success";
      messageEl.textContent = "Signed in successfully!";
      setTimeout(() => checkAuth(), 1000);
    } else {
      messageEl.className = "error";
      messageEl.textContent = data.error_description || "Sign in failed";
    }
  } catch (err) {
    messageEl.className = "error";
    messageEl.textContent = "Connection error. Please try again.";
    console.error("Sign in error:", err);
  }
});

// Sign out handler
document.getElementById("signOutBtn").addEventListener("click", async () => {
  await chrome.storage.local.remove(["authToken", "userEmail", "extensionKey", "savedToday"]);
  checkAuth();
});

// Open dashboard
document.getElementById("openDashboard").addEventListener("click", async () => {
  chrome.tabs.create({ url: await getDashboardUrl() });
});

// Link with extension key (dashboard → Extension → generate)
document.getElementById("linkExtensionKeyBtn").addEventListener("click", async () => {
  const key = document.getElementById("extensionKeyInput").value?.trim();
  const messageEl = document.getElementById("authMessage");
  if (!key) {
    messageEl.className = "error";
    messageEl.textContent = "Paste the extension key from the dashboard.";
    return;
  }
  await chrome.storage.local.set({ extensionKey: key });
  await chrome.storage.local.remove(["authToken", "userEmail"]);
  messageEl.className = "success";
  messageEl.textContent = "Extension linked!";
  document.getElementById("extensionKeyInput").value = "";
  setTimeout(() => checkAuth(), 400);
});

// Google sign-in: open dashboard auth page where Google login already works
document.getElementById("signInGoogleBtn").addEventListener("click", async () => {
  const messageEl = document.getElementById("authMessage");
  if (messageEl) {
    messageEl.className = "";
    messageEl.textContent = "";
  }

  try {
    const base = await getDashboardUrl();
    const url = base.endsWith("/") ? `${base}extension` : `${base}/extension`;
    chrome.tabs.create({ url });
  } catch (err) {
    if (messageEl) {
      messageEl.className = "error";
      messageEl.textContent = "Unable to open Google sign-in page.";
    }
    console.error("Google sign-in exception:", err);
  }
});

// Settings handlers
document.getElementById("saveSettingsBtn").addEventListener("click", async () => {
  const dashboardUrl = document.getElementById("dashboardUrl").value?.trim();
  const supabaseUrl = document.getElementById("supabaseUrl").value?.trim();
  const supabaseAnonKey = document.getElementById("supabaseAnonKey").value?.trim();

  if (dashboardUrl && !/^https?:\/\//i.test(dashboardUrl)) {
    setSettingsMessage("error", "Dashboard URL must start with http:// or https://");
    return;
  }
  if (supabaseUrl && !/^https?:\/\//i.test(supabaseUrl)) {
    setSettingsMessage("error", "Supabase URL must start with http:// or https://");
    return;
  }

  await chrome.storage.local.set({
    dashboardUrl: dashboardUrl || DEFAULT_DASHBOARD_URL,
    ...(supabaseUrl ? { supabaseUrl } : {}),
    ...(supabaseAnonKey ? { supabaseAnonKey } : {}),
  });

  setSettingsMessage("success", "Settings saved.");
});

document.getElementById("resetSettingsBtn").addEventListener("click", async () => {
  await chrome.storage.local.remove(["dashboardUrl", "supabaseUrl", "supabaseAnonKey"]);
  await loadSettingsForm();
  setSettingsMessage("success", "Reset to defaults.");
});

// Get current tab info to detect platform
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || "";
  let platform = "—";
  if (url.includes("chatgpt.com") || url.includes("chat.openai.com")) platform = "ChatGPT";
  else if (url.includes("claude.ai")) platform = "Claude";
  else if (url.includes("gemini.google.com")) platform = "Gemini";
  else if (url.includes("perplexity.ai")) platform = "Perplexity";
  else if (url.includes("poe.com")) platform = "Poe";

  document.getElementById("platform").textContent = platform;
});

// Load saved count from storage
chrome.storage.local.get(["savedToday"], (result) => {
  document.getElementById("count").textContent = result.savedToday || 0;
});

// Initialize
checkAuth();
loadSettingsForm();
