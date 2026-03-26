// API utility for sending captured messages to the backend
// Uses Supabase Edge Functions

// Defaults (safe to ship in extension; this is the public anon/publishable key)
const DEFAULT_SUPABASE_URL = "https://vdlkoqdzqzelzgtrwtyr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbGtvcWR6cXplbHpndHJ3dHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDI4MDYsImV4cCI6MjA4ODcxODgwNn0.H6eOEnMGKMKL26yE8_mFxWQn19BYqm8-Suv5zpGYbhM";

async function getConfig() {
  const { supabaseUrl, supabaseAnonKey } = await chrome.storage.local.get([
    "supabaseUrl",
    "supabaseAnonKey",
  ]);
  return {
    supabaseUrl: supabaseUrl || DEFAULT_SUPABASE_URL,
    supabaseAnonKey: supabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY,
  };
}

export function getSupabaseUrl() {
  return DEFAULT_SUPABASE_URL;
}

export function getSupabaseAnonKey() {
  return DEFAULT_SUPABASE_ANON_KEY;
}

export async function captureConversation(platform, title, messages, authToken, { summary, tags } = {}) {
  const { supabaseUrl, supabaseAnonKey } = await getConfig();
  const { extensionKey } = await chrome.storage.local.get("extensionKey");

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseAnonKey,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  } else if (extensionKey) {
    headers["X-Extension-Key"] = extensionKey;
  } else {
    throw new Error("Not authenticated: sign in or paste an extension key in the popup.");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/capture-conversation`, {
    method: "POST",
    headers,
    body: JSON.stringify({ platform, title, summary, tags, messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  // Increment saved count for today
  const today = new Date().toDateString();
  const { lastSavedDate, savedToday } = await chrome.storage.local.get(["lastSavedDate", "savedToday"]);
  
  if (lastSavedDate === today) {
    await chrome.storage.local.set({ savedToday: (savedToday || 0) + 1 });
  } else {
    await chrome.storage.local.set({ lastSavedDate: today, savedToday: 1 });
  }

  return response.json();
}

export async function getConversations(authToken) {
  const { supabaseUrl, supabaseAnonKey } = await getConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/conversations?select=*&order=created_at.desc`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      apikey: supabaseAnonKey,
    },
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
