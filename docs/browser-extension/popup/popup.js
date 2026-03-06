// Popup script — shows connection status and opens dashboard

document.getElementById("openDashboard").addEventListener("click", () => {
  // TODO: Replace with your dashboard URL
  chrome.tabs.create({ url: "https://your-dashboard-url.lovable.app" });
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
