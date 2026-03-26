// Poe message extractor
// Handles message bubbles in the main chat area.

export function extractMessages() {
  const messages = [];

  // Poe renders messages as bubbles with role-specific classes.
  const messageEls = document.querySelectorAll("[data-testid='chat-message'], [class*='MessageRow']");

  messageEls.forEach((el) => {
    const className = el.className || "";
    let role = null;

    if (el.getAttribute("data-testid") === "chat-message") {
      if (el.getAttribute("data-source") === "user") role = "user";
      if (el.getAttribute("data-source") === "bot") role = "assistant";
    }

    if (!role) {
      if (className.includes("user") || className.includes("Human")) role = "user";
      else if (className.includes("bot") || className.includes("Assistant")) role = "assistant";
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

