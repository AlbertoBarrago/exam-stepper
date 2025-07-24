import { BookOpen, Headphones, Mic, PenTool } from 'lucide-react';

const QUESTION_KINDS = [
  'reading-question',
  'listening-question',
  'writing-question',
  'speaking-question',
];

const SECTIONS = ['reading', 'listening', 'writing', 'speaking'] as const;

const stepKindToSection = (kind: string): string | null => {
  if (kind.startsWith('reading')) return 'reading';
  if (kind.startsWith('listening')) return 'listening';
  if (kind.startsWith('writing')) return 'writing';
  if (kind.startsWith('speaking')) return 'speaking';
  return null;
};

export const SECTION_DATA = [
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
export { QUESTION_KINDS, SECTIONS, stepKindToSection };
