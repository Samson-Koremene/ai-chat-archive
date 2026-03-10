// API utility for sending captured messages to the backend
// Uses Supabase Edge Functions

const SUPABASE_URL = "YOUR_SUPABASE_URL"; // e.g. https://vdlkoqdzqzelzgtrwtyr.supabase.co
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

export async function captureConversation(platform, title, messages, authToken, { summary, tags } = {}) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/capture-conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ platform, title, summary, tags, messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${response.status}`);
  }
  return response.json();
}

export async function getConversations(authToken) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/conversations?select=*&order=created_at.desc`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      apikey: SUPABASE_ANON_KEY,
    },
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
