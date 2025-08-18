# Exam Flow Guide

This guide provides a comprehensive overview of the exam flow in this application, from the moment a student starts an exam to the final score calculation. It also includes a section on how to implement a manual or AI-powered review process for open-ended questions.

## 1. Exam Initialization

The exam process begins when a student navigates to the exam page. Here's how it works:

- **Frontend Trigger**: The `app/exam/[attemptId]/Exam.tsx` component is responsible for initiating the exam. It uses the `useEffect` hook to call the `startExam` function from `app/services/apiService.ts`.

- **Backend Process**: The `startExam` function sends a request to the `/api/exam/start/route.ts` endpoint. This endpoint creates a new record in the `exams` table and then creates a corresponding record for each step of the exam in the `exam_steps` table. This pre-populates the database with all the steps the student will take, allowing us to track their progress in real-time.

## 2. Step Progression

Once the exam is initialized, the student progresses through the steps one by one. Here's how the application handles this:

- **State Management**: The `app/state/stepStore.tsx` and `app/state/timerStore.ts` files are responsible for managing the state of the exam, including the current step and the time remaining.

- **Rendering the Current Step**: The `app/hooks/useStepBody.tsx` hook determines which step component to render based on the current step index. It dynamically loads the appropriate component from the `app/components/steps` directory.

- **Step Components**: Each step component (e.g., `ReadingTask.tsx`, `SpeakingTask.tsx`) is responsible for presenting the question to the student and collecting their answer.

## 3. Submitting Step Results

After the student completes a step, their answer is sent to the backend to be saved. Here's how this process works:

- **Frontend Submission**: The step component calls a function from `app/services/apiService.ts` to send the student's answer to the backend.

- **Backend Processing**: The `/api/exam/step-result/route.ts` endpoint receives the answer and updates the corresponding record in the `exam_steps` table with the `raw_score` and `max_score`.

## 4. Finalizing the Exam

Once the student has completed all the steps, the exam is finalized and the final score is calculated.

- **Frontend Trigger**: The `app/exam/[attemptId]/steps/Final/FinalRecapStep.tsx` component triggers the finalization process.

- **Backend Calculation**: The `/api/exam/[examId]/finalize/route.ts` endpoint fetches all the step results for the exam from the `exam_steps` table. It then uses the `calculateFinalScore` function from `app/services/scoringService.ts` to calculate the final score. The final score and the corresponding CEFR level are then saved in the `exams` table.

## 5. Implementing Manual or AI Review

For open-ended questions like speaking or writing, you may want to implement a manual or AI-powered review process. Here's a high-level overview of how you could do this:

### Option 1: Manual Review

1.  **Add a `status` field** to the `exam_steps` table. This field could have values like `pending_review`, `reviewed`, or `auto-scored`.

2.  **Create a new API endpoint** (e.g., `/api/exam/step-result/review`) that allows a teacher to submit a score for a specific step. This endpoint would update the `raw_score` and `max_score` for the step and set the `status` to `reviewed`.

3.  **Build a teacher dashboard** that displays all the steps that are `pending_review`. This dashboard would allow teachers to view the student's answer and submit a score.

### Option 2: AI-Powered Review

1.  **Choose an AI service** that can score open-ended questions. There are many services available that can provide a score and feedback on a student's writing or speaking.

2.  **Create a new API endpoint** (e.g., `/api/exam/step-result/ai-review`) that sends the student's answer to the AI service. This endpoint would then update the `raw_score` and `max_score` for the step and set the `status` to `auto-scored`.

3.  **Integrate the AI service** into your application. You would need to call the AI service from your new API endpoint and handle the response.
