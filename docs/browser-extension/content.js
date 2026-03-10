// Main content script — loads the correct adapter based on detected platform

(async () => {
  const platform = window.__memoryAI_platform;
  if (!platform) return;

  console.log(`[MemoryAI] Detected platform: ${platform}`);

  try {
    const adapter = await import(`./adapters/${platform}/extractor.js`);
    const observer = await import(`./adapters/${platform}/observer.js`);
    const { captureConversation } = await import("./utils/api.js");

    // Get auth token from storage (set via popup after login)
    const { authToken } = await chrome.storage.local.get("authToken");
    if (!authToken) {
      console.warn("[MemoryAI] Not authenticated. Please log in via the extension popup.");
      return;
    }

    observer.startObserving((newMessages) => {
      const normalized = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toISOString(),
      }));

      const title = adapter.extractTitle?.() || `${platform} conversation`;

      captureConversation(platform, title, normalized, authToken)
        .then((res) => console.log("[MemoryAI] Saved:", res))
        .catch((err) => console.error("[MemoryAI] API error:", err));
    });
  } catch (err) {
    console.error(`[MemoryAI] Failed to load adapter for ${platform}:`, err);
  }
})();
