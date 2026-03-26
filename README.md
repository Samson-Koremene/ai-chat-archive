# Multi-AI Chat Memory

A comprehensive system for capturing, managing, and analyzing conversations across multiple AI platforms (ChatGPT, Claude, Gemini, Perplexity, Poe).

## Features

### Core Functionality

- **Browser Extension**: Automatically captures conversations from AI platforms in real-time
- **Web Dashboard**: Modern React app for viewing and managing captured conversations
- **Multi-Platform Support**: Works with ChatGPT, Claude, Gemini, Perplexity, and Poe
- **Full Authentication**: Secure user authentication via Supabase with Row Level Security

### Conversation Management

- **Edit & Delete**: Modify conversation titles, summaries, and tags
- **Tag System**: Organize conversations with custom tags
- **Platform Filtering**: Filter conversations by AI platform
- **Message History**: View complete conversation threads with timestamps

### Search & Discovery

- **Full-Text Search**: PostgreSQL-powered search across titles, summaries, tags, and message content
- **Tag Browser**: Browse and filter conversations by tags
- **Advanced Filtering**: Search within specific platforms or date ranges

### Analytics & Insights

- **Platform Distribution**: Visualize conversation distribution across AI platforms
- **Activity Timeline**: Track conversation activity over the last 30 days
- **Tag Analytics**: See your most-used tags and topics
- **Usage Statistics**: Total messages, average messages per conversation, most active days

### Export Functionality

- **Multiple Formats**: Export to JSON, CSV, or Markdown
- **Selective Export**: Choose specific conversations to export
- **Include/Exclude Messages**: Export metadata only or full conversation content
- **Batch Operations**: Export multiple conversations at once

### Prompt Library

- **Curated Prompts**: Collection of effective prompts organized by category
- **One-Click Copy**: Easily copy prompts to clipboard
- **Platform-Specific**: Prompts optimized for different AI platforms

## Project Structure

```
├── src/                          # React web application
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Page components
│   │   ├── Index.tsx           # Dashboard overview
│   │   ├── Conversations.tsx   # Conversation list
│   │   ├── ConversationDetail.tsx  # Single conversation view
│   │   ├── SearchPage.tsx      # Full-text search
│   │   ├── Tags.tsx            # Tag management
│   │   ├── Analytics.tsx       # Analytics dashboard
│   │   ├── Export.tsx          # Export functionality
│   │   └── Prompts.tsx         # Prompt library
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # React contexts (Auth)
│   └── test/                    # Test files
├── docs/browser-extension/      # Chrome extension (MV3)
│   ├── manifest.json
│   ├── content.js              # Main content script
│   ├── platformDetector.js     # Platform detection
│   ├── popup/                  # Extension popup UI
│   └── adapters/               # Platform-specific extractors
│       ├── chatgpt/
│       ├── claude/
│       └── ...
├── supabase/
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge functions
│       └── capture-conversation/  # API endpoint for capturing
└── package.json
```

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **TanStack Query** for data fetching
- **React Router** for navigation
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **Recharts** for analytics visualizations
- **Framer Motion** for animations

### Backend

- **Supabase** for authentication and database
- **PostgreSQL** with full-text search
- **Supabase Edge Functions** (Deno) for API endpoints
- **Row Level Security** for data isolation

### Browser Extension

- **Chrome Manifest V3**
- **Vanilla JavaScript** (no bundler needed)
- **Adapter pattern** for multi-platform support

### Testing

- **Vitest** for unit tests
- **Testing Library** for component tests
- **Deno test** for edge function tests

## Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Chrome/Edge browser (for extension)

### Web App Setup

```sh
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations
# (Use Supabase CLI or dashboard)

# Start development server
npm run dev
```

### Browser Extension Setup

1. Update `docs/browser-extension/utils/api.js` with your Supabase URL and anon key
2. Update `docs/browser-extension/popup/popup.js` with your dashboard URL
3. Load extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `docs/browser-extension` folder

### Database Setup

Run the migrations in order:

1. `20260310121631_506191ae-45e5-4ae4-8c90-7d60bce696b1.sql` - Initial schema
2. `20260312000000_add_full_text_search.sql` - Full-text search
3. `20260314000000_extension_keys.sql` - Extension API keys (hashed)

### Edge Functions (extension keys)

Set the **service role** secret so `generate-extension-key` and capture via `X-Extension-Key` work:

```sh
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Deploy or push functions after changing code:

```sh
supabase functions deploy generate-extension-key
supabase functions deploy capture-conversation
```

See `docs/AUTH.md` for the full auth story.

### Browser extension (Google-friendly)

1. Sign in to the dashboard with Google (or any provider).
2. Open **Extension** in the sidebar, generate an **extension key**, copy it.
3. In the extension popup, paste the key under **Extension key** → **Link with extension key**.

Email/password in the popup still works as an alternative.

## Usage

### Capturing Conversations

1. Install and authenticate via the browser extension popup
2. Navigate to any supported AI platform
3. Have a conversation - it will be automatically captured
4. View captured conversations in the web dashboard

### Managing Conversations

- **Edit**: Click the edit icon on any conversation detail page
- **Delete**: Use the delete button (with confirmation)
- **Tag**: Add comma-separated tags when editing
- **Export**: Go to Export page, select conversations, choose format

### Searching

- Use the Search page for full-text search across all content
- Search results are split into Conversations and Messages tabs
- Click on message results to jump to the full conversation

### Analytics

- View platform distribution pie chart
- See activity timeline for the last 30 days
- Explore top tags bar chart
- Check usage statistics

## Testing

```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run edge function tests
cd supabase/functions/capture-conversation
deno test
```

## Adding a New AI Platform

1. Create `docs/browser-extension/adapters/<platform>/extractor.js`
2. Create `docs/browser-extension/adapters/<platform>/observer.js`
3. Add URL pattern to `docs/browser-extension/platformDetector.js`
4. Add platform to database enum (if needed)
5. Add platform metadata to `src/lib/mock-data.ts`

No backend changes required!

## Deployment

### Web App

Deploy to any static hosting service (Vercel, Netlify, etc.):

```sh
npm run build
```

### Browser Extension

1. Build a production version (if using bundler)
2. Create a ZIP file of the extension folder
3. Submit to Chrome Web Store

### Database

Supabase handles hosting automatically. Just run migrations via CLI or dashboard.

## Security

- All API requests require authentication
- Row Level Security ensures users only see their own data
- Browser extension stores auth tokens securely in chrome.storage
- CORS configured for edge functions
- Input validation on all API endpoints

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Support

For issues or questions, please open a GitHub issue.
