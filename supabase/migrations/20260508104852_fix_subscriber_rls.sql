-- Ensure anonymous users can subscribe
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Also allow anonymous users to check if they're already subscribed (for duplicate checking)
CREATE POLICY "Anonymous can check subscription"
ON public.subscribers
FOR SELECT
TO anon
USING (false);