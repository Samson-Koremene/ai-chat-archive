-- One extension key per user (hashed). Managed only via Edge Functions (service role).
CREATE TABLE public.extension_keys (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);

CREATE INDEX idx_extension_keys_key_hash ON public.extension_keys(key_hash);

ALTER TABLE public.extension_keys ENABLE ROW LEVEL SECURITY;
-- No policies: deny direct access for anon/authenticated via PostgREST; service role bypasses RLS.
