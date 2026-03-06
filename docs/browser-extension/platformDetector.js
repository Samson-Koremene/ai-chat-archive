// Maps current URL to the correct adapter
// To add a new platform: add a new entry here and create adapters/<platform>/

const PLATFORM_MAP = [
  { pattern: /chat\.openai\.com|chatgpt\.com/, platform: "chatgpt" },
  { pattern: /claude\.ai/, platform: "claude" },
  { pattern: /gemini\.google\.com/, platform: "gemini" },
  { pattern: /perplexity\.ai/, platform: "perplexity" },
  { pattern: /poe\.com/, platform: "poe" },
];

function detectPlatform() {
  const url = window.location.href;
  for (const entry of PLATFORM_MAP) {
    if (entry.pattern.test(url)) return entry.platform;
  }
  return null;
}

// Expose to content.js
window.__memoryAI_platform = detectPlatform();
