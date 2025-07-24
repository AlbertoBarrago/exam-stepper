'use client';

import WritingTask from '@/components/step/WritingTask';
import { WritingTypes } from '@/types/writingTypes';

export default function WritingStep({ onNextAction }: WritingTypes) {
  const handleTextChange = (text: string, wordCount: number) => {
    console.log('Text changed:', { text, wordCount });
  };

  const submitToAi = () => {
    // TODO: add AI analysis for text, than go Next...

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
