import WritingTask from '@/components/steps/WritingTask';
import { WritingTypes } from '@/types/writingTypes';
import { useExamStore } from '@/state/examStore';

export default function WritingStep({ onNextAction }: WritingTypes) {
  const setSectionScore = useExamStore((s) => s.setSectionScore);

  const handleTextChange = (text: string, wordCount: number) => {
    console.log('Text changed:', { text, wordCount });
  };

  const submitToAi = async (text: string) => {
    try {
      const response = await fetch('/api/exam/writing-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawScore = data.score;
      const detailedDescription = data.detailedDescription;

      console.log('AI Detailed Description:', detailedDescription);

      const maxScore = 20;

      setSectionScore('writing', { rawScore, maxScore });

      onNextAction();
    } catch (error) {
      console.error('Error submitting text for AI analysis:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <WritingTask
      title="Write a clear and compelling job advertisement."
      placeholder="Start your answer here..."
      minWords={50}
      maxWords={150}
      onTextChange={handleTextChange}
      onSubmit={submitToAi}
      buttonText="Submit"
    />
  );
}
