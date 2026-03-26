# Browser Extension Reference (Chrome/Edge MV3)

This folder contains reference code for the Multi-AI Chat Memory browser extension.
**This code does NOT run in this app** — build it separately with standard web extension tooling.

## Folder Structure

```
extension/
├── manifest.json
├── popup/
│   ├── popup.html
│   └── popup.js
├── content.js
├── platformDetector.js
├── utils/
│   └── api.js
└── adapters/
    ├── chatgpt/
    │   ├── extractor.js
    │   └── observer.js
    ├── claude/
    │   ├── extractor.js
    │   └── observer.js
    └── gemini/
        ├── extractor.js
        └── observer.js
```

## Adding a New Platform

1. Create `adapters/<platform>/extractor.js` and `observer.js`
2. Add URL pattern to `platformDetector.js`
3. Done — no backend changes needed
