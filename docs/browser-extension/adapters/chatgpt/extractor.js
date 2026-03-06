// ChatGPT message extractor
// Selectors may change — update as needed when ChatGPT updates their UI

export function extractMessages() {
  const messages = [];
  // ChatGPT renders messages in article elements or divs with data-message-author-role
  const messageEls = document.querySelectorAll("[data-message-author-role]");

  messageEls.forEach((el) => {
    const role = el.getAttribute("data-message-author-role"); // "user" or "assistant"
    const contentEl = el.querySelector(".markdown, .whitespace-pre-wrap");
    if (contentEl && role) {
      messages.push({
        role: role === "user" ? "user" : "assistant",
        content: contentEl.innerText.trim(),
      });
    }
  });

  return messages;
}
