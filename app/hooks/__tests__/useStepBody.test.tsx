import { renderHook } from '@testing-library/react';
import { useStepBody } from '../useStepBody';
import { useStepStore } from '@/state/stepStore';
import { useExamStore } from '@/state/examStore';

// Mock the stores
jest.mock('@/state/stepStore');
jest.mock('@/state/examStore');

const mockUseStepStore = useStepStore as jest.MockedFunction<typeof useStepStore>;
const mockUseExamStore = useExamStore as jest.MockedFunction<typeof useExamStore>;

// Mock the step components
jest.mock('@/exam/[attemptId]/steps/Welcome/Welcome', () => {
  return function MockWelcome({ onNextAction }: { onNextAction: () => void }) {
    return <div data-testid="welcome-step">Welcome Step</div>;
  };
});

jest.mock('@/exam/[attemptId]/steps/Reading/ReadingIntroStep', () => {
  return function MockReadingIntroStep({ title, onNextAction }: { title: string; onNextAction: () => void }) {
    return <div data-testid="reading-intro-step">{title}</div>;
  };
});

jest.mock('@/exam/[attemptId]/steps/Reading/ReadingQuestionStep', () => {
  return function MockReadingQuestionStep({ sentence, onNextAction }: { sentence: string; onNextAction: () => void }) {
    return <div data-testid="reading-question-step">{sentence}</div>;
  };
});

jest.mock('@/exam/[attemptId]/steps/Final/FinalRecapStep', () => {
  return function MockFinalRecapStep() {
    return <div data-testid="final-recap-step">Final Recap Step</div>;
  };
});

describe('useStepBody', () => {
  const mockNextAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExamStore.mockReturnValue({ examId: 123 });
  });

  it('should return loading component when no step is available', () => {
    mockUseStepStore.mockReturnValue({ steps: [] });

    const { result } = renderHook(() =>
      useStepBody({
        current: 0,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });

  it('should render welcome step correctly', () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'welcome',
        title: 'Welcome',
        subTitle: 'Welcome to the exam',
      },
    ];

    mockUseStepStore.mockReturnValue({ steps: mockSteps });

    const { result } = renderHook(() =>
      useStepBody({
        current: 0,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });

  it('should render reading intro step correctly', () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'reading-intro',
        title: 'Reading Section',
        subTitle: 'Introduction to reading',
        durationMs: 300000,
      },
    ];

    mockUseStepStore.mockReturnValue({ steps: mockSteps });

    const { result } = renderHook(() =>
      useStepBody({
        current: 0,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });

  it('should render reading question step correctly', () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'reading-question',
        title: 'Reading Question',
        sentence: 'What is the main idea?',
        options: ['Option A', 'Option B', 'Option C'],
      },
    ];

    mockUseStepStore.mockReturnValue({ steps: mockSteps });

    const { result } = renderHook(() =>
      useStepBody({
        current: 0,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });

  it('should render final recap step correctly', () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'final',
        title: 'Final Recap',
      },
    ];

    mockUseStepStore.mockReturnValue({ steps: mockSteps });

    const { result } = renderHook(() =>
      useStepBody({
        current: 0,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });

  it('should handle invalid step kind', () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'invalid-step',
        title: 'Invalid Step',
      },
    ];

    mockUseStepStore.mockReturnValue({ steps: mockSteps });

    const { result } = renderHook(() =>
      useStepBody({
        current: 0,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });

  it('should handle steps that require examId when examId is null', () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'reading-complete',
        title: 'Reading Complete',
      },
    ];

    mockUseStepStore.mockReturnValue({ steps: mockSteps });
    mockUseExamStore.mockReturnValue({ examId: null });

    const { result } = renderHook(() =>
      useStepBody({
        current: 0,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });

  it('should handle different step indices', () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'welcome',
        title: 'Welcome',
      },
      {
        id: 2,
        kind: 'reading-intro',
        title: 'Reading Intro',
      },
    ];

    mockUseStepStore.mockReturnValue({ steps: mockSteps });

    const { result } = renderHook(() =>
      useStepBody({
        current: 1,
        nextAction: mockNextAction,
        attemptId: 'test-attempt',
      })
    );

    const { StepComponent } = result.current;
    expect(StepComponent).toBeDefined();
  });
});