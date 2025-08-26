-- RLS Policy for SELECT operations on exam_steps
CREATE POLICY "Allow individual user to select their own exam steps"
ON "public"."exam_steps"
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM exams
    WHERE exams.id = exam_steps.exam_id AND exams.user_id = auth.uid()
  )
);

-- RLS Policy for UPDATE operations on exam_steps
CREATE POLICY "Allow individual user to update their own exam steps"
ON "public"."exam_steps"
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM exams
    WHERE exams.id = exam_steps.exam_id AND exams.user_id = auth.uid()
  )
);
