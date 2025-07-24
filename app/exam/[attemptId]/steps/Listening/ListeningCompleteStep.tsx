import SectionComplete from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';
import { BookOpen, Headphones, Mic, PenTool } from 'lucide-react';

export default function ListeningCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const handleNext = () => {
    onNextAction();
  };

  const sections = [
    {
      id: 'reading',
      name: 'Reading',
      duration: '20 mins',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'listening',
      name: 'Listening',
      duration: '20 mins',
      icon: Headphones,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'writing',
      name: 'Writing',
      duration: '35 mins',
      icon: PenTool,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'speaking',
      name: 'Speaking',
      duration: '15 mins',
      icon: Mic,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <SectionComplete
      completedSection="listening"
      nextSection="writing"
      sections={sections}
      onContinue={handleNext}
    />
  );
}
