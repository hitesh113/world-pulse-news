-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;

-- Create the new policy that explicitly allows anonymous users
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO anon
WITH CHECK (true);