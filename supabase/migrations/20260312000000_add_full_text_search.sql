-- Add full-text search capabilities

-- Add tsvector column for full-text search on conversations
ALTER TABLE public.conversations ADD COLUMN search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_conversation_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
CREATE TRIGGER conversations_search_vector_update
  BEFORE INSERT OR UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_search_vector();

-- Create GIN index for fast full-text search
CREATE INDEX idx_conversations_search_vector ON public.conversations USING GIN(search_vector);

-- Update existing rows
UPDATE public.conversations SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(summary, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'C');

-- Add full-text search on messages content
ALTER TABLE public.messages ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION update_message_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_search_vector_update
  BEFORE INSERT OR UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_search_vector();

CREATE INDEX idx_messages_search_vector ON public.messages USING GIN(search_vector);

UPDATE public.messages SET search_vector = to_tsvector('english', COALESCE(content, ''));
