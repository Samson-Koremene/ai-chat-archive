// Gemini message extractor
// DOM structure may change over time; selectors chosen to be resilient.

export function extractMessages() {
  const messages = [];

  // Gemini chat messages often use data attributes or role markers on message containers.
  const messageEls = document.querySelectorAll("[data-message-author-role], [data-chat-message]");

  messageEls.forEach((el) => {
    let role =
      el.getAttribute("data-message-author-role") ||
      (el.getAttribute("data-chat-message") === "user" ? "user" : "assistant");

    if (!role) {
      const className = el.className || "";
      if (className.includes("user")) role = "user";
      else if (className.includes("model") || className.includes("assistant")) role = "assistant";
    }

    const contentEl =
      el.querySelector("[data-message-text], .markdown, .prose, [data-content]") || el;
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

