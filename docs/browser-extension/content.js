// Main content script — loads the correct adapter based on detected platform

(async () => {
  const platform = window.__memoryAI_platform;
  if (!platform) return;

  console.log(`[MemoryAI] Detected platform: ${platform}`);

  // Dynamic import of adapter modules
  // In production, bundle these or use chrome.scripting.executeScript
  try {
    const adapter = await import(`./adapters/${platform}/extractor.js`);
    const observer = await import(`./adapters/${platform}/observer.js`);

    // Start observing for new messages
    observer.startObserving((newMessages) => {
      // Normalize messages to standard format
      const normalized = newMessages.map((msg) => ({
        role: msg.role, // "user" or "assistant"
        content: msg.content,
        timestamp: new Date().toISOString(),
      }));

      // Send to backend API
      // Replace YOUR_API_URL with your actual backend URL
      fetch("YOUR_API_URL/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, messages: normalized }),
      }).catch((err) => console.error("[MemoryAI] API error:", err));
    });
  } catch (err) {
    console.error(`[MemoryAI] Failed to load adapter for ${platform}:`, err);
  }
})();
