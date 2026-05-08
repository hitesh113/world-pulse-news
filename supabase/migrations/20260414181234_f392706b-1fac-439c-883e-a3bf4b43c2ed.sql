
-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  author TEXT,
  cover_image_url TEXT,
  excerpt TEXT,
  body TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'manual'
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public can read published articles"
ON public.articles
FOR SELECT
USING (status = 'published');

-- Authenticated users have full access
CREATE POLICY "Authenticated users can insert articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete articles"
ON public.articles
FOR DELETE
TO authenticated
USING (true);

-- Create subscribers table
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  onesignal_player_id TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Authenticated users can read subscribers
CREATE POLICY "Authenticated users can read subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can delete subscribers
CREATE POLICY "Authenticated users can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (true);

-- Authenticated users can update subscribers (for onesignal_player_id)
CREATE POLICY "Authenticated users can update subscribers"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (true);
