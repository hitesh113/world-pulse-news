-- Update RLS policies to be more restrictive

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.articles;

-- Public can read published articles (no change needed)
CREATE POLICY "Public can read published articles"
ON public.articles
FOR SELECT
USING (status = 'published');

-- Only admin users can manage articles
CREATE POLICY "Admin users can insert articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin'
      OR auth.users.email = 'admin@worldpulse.app'
    )
  )
);

CREATE POLICY "Admin users can update articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin'
      OR auth.users.email = 'admin@worldpulse.app'
    )
  )
);

CREATE POLICY "Admin users can delete articles"
ON public.articles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin'
      OR auth.users.email = 'admin@worldpulse.app'
    )
  )
);

-- Update subscriber policies (keep anonymous subscription but restrict management)
DROP POLICY IF EXISTS "Authenticated users can read subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Authenticated users can delete subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Authenticated users can update subscribers" ON public.subscribers;

CREATE POLICY "Admin users can read subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin'
      OR auth.users.email = 'admin@worldpulse.app'
    )
  )
);

CREATE POLICY "Admin users can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin'
      OR auth.users.email = 'admin@worldpulse.app'
    )
  )
);

CREATE POLICY "Admin users can update subscribers"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin'
      OR auth.users.email = 'admin@worldpulse.app'
    )
  )
);