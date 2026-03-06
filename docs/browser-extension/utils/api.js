// API utility for sending captured messages to the backend
// Replace API_BASE_URL with your actual backend URL

const API_BASE_URL = "YOUR_BACKEND_URL"; // TODO: Replace with your backend URL

export async function sendMessages(platform, messages, authToken) {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ platform, messages }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function getConversations(authToken) {
  const response = await fetch(`${API_BASE_URL}/api/conversations`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
