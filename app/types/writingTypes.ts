export type WritingTypes = { title: string; onNextAction: () => void };

export type WritingTaskProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  minWords?: number;
  maxWords?: number;
  onTextChange?: (text: string, wordCount: number) => void;
  onSubmit: (text: string) => void;
  initialText?: string;
  buttonText?: string;
};
