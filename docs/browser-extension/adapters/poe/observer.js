import { extractMessages } from "./extractor.js";

let lastMessageCount = 0;

export function startObserving(onNewMessages) {
  const targetNode = document.querySelector("main") || document.body;

  const observer = new MutationObserver(() => {
    const messages = extractMessages();
    if (messages.length > lastMessageCount) {
      const newMessages = messages.slice(lastMessageCount);
      lastMessageCount = messages.length;
      onNewMessages(newMessages);
    }
  });

  observer.observe(targetNode, { childList: true, subtree: true });
  console.log("[MemoryAI] Poe observer started");

  return observer;
}

