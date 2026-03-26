// Perplexity message extractor
// Tries to capture both user prompts and assistant answers.

export function extractMessages() {
  const messages = [];

  // Common structure: conversation turns as list items / divs with data attributes
  const messageEls = document.querySelectorAll("[data-message-author-role], [data-testid='conversation-turn']");

  messageEls.forEach((el) => {
    let role = el.getAttribute("data-message-author-role");

    if (!role) {
      const className = el.className || "";
      if (className.includes("user") || className.includes("question")) role = "user";
      else if (className.includes("assistant") || className.includes("answer")) role = "assistant";
    }

    const contentEl =
      el.querySelector(".markdown, .prose, [data-testid='message-text']") || el;
    const text = contentEl.innerText?.trim();

    if (text && role) {
      messages.push({
        role: role === "user" ? "user" : "assistant",
        content: text,
      });
    }
  });

  return messages;
}

