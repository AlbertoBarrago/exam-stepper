-- RLS Policy for INSERT operations on exams
CREATE POLICY "Allow authenticated users to create their own exams"
ON "public"."exams"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- RLS Policy for INSERT operations on exam_steps
CREATE POLICY "Allow authenticated users to create exam steps"
ON "public"."exam_steps"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM exams
    WHERE exams.id = exam_steps.exam_id AND exams.user_id = auth.uid()
  )
);
