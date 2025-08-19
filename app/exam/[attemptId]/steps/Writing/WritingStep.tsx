import WritingTask from '@/components/steps/WritingTask';
import { WritingTypes } from '@/types/writingTypes';
import { useExamStore } from '@/state/examStore';

export default function WritingStep({ onNextAction }: WritingTypes) {
  const setSectionScore = useExamStore((s) => s.setSectionScore);

  const handleTextChange = (text: string, wordCount: number) => {
    console.log('Text changed:', { text, wordCount });
  };

  const submitToAi = async () => {
    // TODO: Implement AI scoring
    const rawScore = 15; // Mocked score
    const maxScore = 20; // Mocked score

    setSectionScore('writing', { rawScore, maxScore });

    onNextAction();
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
