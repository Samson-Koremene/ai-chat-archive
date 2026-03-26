// Main content script — loads the correct adapter based on detected platform

(async () => {
  const platform = window.__memoryAI_platform;
  if (!platform) return;

  console.log(`[MemoryAI] Detected platform: ${platform}`);

  try {
    const extractorUrl = chrome.runtime.getURL(`adapters/${platform}/extractor.js`);
    const observerUrl = chrome.runtime.getURL(`adapters/${platform}/observer.js`);
    const apiUrl = chrome.runtime.getURL("utils/api.js");

    const adapter = await import(extractorUrl);
    const observer = await import(observerUrl);
    const { captureConversation } = await import(apiUrl);

    observer.startObserving(async (newMessages) => {
      // Read latest auth token each time so capture starts working
      // as soon as the user signs in from the popup.
      const { authToken, extensionKey } = await chrome.storage.local.get(["authToken", "extensionKey"]);
      if (!authToken && !extensionKey) {
        console.warn("[MemoryAI] Not authenticated. Open the extension popup and sign in or paste your extension key.");
        return;
      }

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
