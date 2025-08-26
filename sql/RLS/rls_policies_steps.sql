-- RLS Policy for SELECT operations on steps
CREATE POLICY "Allow authenticated users to select all steps"
ON "public"."steps"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);
