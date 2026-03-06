// Claude message extractor
// Selectors may change — update when Claude updates their UI

export function extractMessages() {
  const messages = [];
  // Claude uses specific class patterns for human/assistant messages
  const messageEls = document.querySelectorAll("[class*='Message']");

  messageEls.forEach((el) => {
    const isHuman = el.querySelector("[class*='human']") || el.classList.toString().includes("human");
    const contentEl = el.querySelector("[class*='content'], .prose");
    if (contentEl) {
      messages.push({
        role: isHuman ? "user" : "assistant",
        content: contentEl.innerText.trim(),
      });
    }
  });

  return messages;
}
