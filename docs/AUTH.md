# Authentication: web app & browser extension

## Web app

Users sign in with **Supabase Auth** (email/password, Google OAuth, etc.) on `/auth` as usual.

## Browser extension

The extension needs credentials to call the `capture-conversation` Edge Function. Two supported paths:

### 1) Extension key (recommended for Google-only users)

1. Sign in to the dashboard (e.g. with Google).
2. Open **Extension** (`/extension`) and click **Generate new extension key**.
3. Copy the key and paste it into the extension popup → **Link with extension key**.

Keys are stored as **SHA-256 hashes** in `public.extension_keys`. The plain key is shown only once.

### 2) Email + password in the popup

Uses `grant_type=password` against Supabase Auth. Works if the user has a password on their account.

## Edge Function secrets

`generate-extension-key` and `capture-conversation` (extension-key path) require **`SUPABASE_SERVICE_ROLE_KEY`** in the Edge Function environment (Supabase Dashboard → Project Settings → Edge Functions → Secrets, or `supabase secrets set`).

Never expose the service role key in client-side code or the extension bundle.
