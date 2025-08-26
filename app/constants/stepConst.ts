export const DURATION_INTRODUCTION_MS = 5000;

// The logic follows the name convention of the folder structure
// e.g. welcome.tsx -> Welcome
export enum StepKind {
  Welcome = 'welcome',
  Permission = 'permission',
  ReadingLogin = 'reading-login',
  ReadingQuestion = 'reading-question',
  ReadingQuestionList = 'reading-question-list',
  ReadingComplete = 'reading-complete',
  ListeningLogin = 'listening-login',
  ListeningQuestion = 'listening-question',
  ListeningComplete = 'listening-complete',
  WritingLogin = 'writing-login',
  WritingQuestion = 'writing-question',
  WritingComplete = 'writing-complete',
  SpeakingLogin = 'speaking-login',
  SpeakingQuestion = 'speaking-question',
  SpeakingComplete = 'speaking-complete',
  Final = 'final',
}
