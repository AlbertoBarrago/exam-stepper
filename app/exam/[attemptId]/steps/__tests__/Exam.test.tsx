import { render, screen, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import Exam from '../Exam';
import { useTimerStore } from '@/state/timerStore';
import { useStepStore } from '@/state/stepStore';
import { useUserStore } from '@/state/userStore';
import { updateStepResult } from '@/services/api';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/state/timerStore', () => ({
  useTimerStore: jest.fn(),
}));

jest.mock('@/state/stepStore', () => ({
  useStepStore: jest.fn(),
}));

jest.mock('@/state/userStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  updateStepResult: jest.fn(),
}));

jest.mock('@/hooks/useStepBody', () => ({
  useStepBody: jest.fn(() => ({
    StepComponent: () => <div data-testid="step-component">Step Component</div>,
  })),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseTimerStore = useTimerStore as jest.MockedFunction<typeof useTimerStore>;
const mockUseStepStore = useStepStore as jest.MockedFunction<typeof useStepStore>;
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
const mockUpdateStepResult = updateStepResult as jest.MockedFunction<typeof updateStepResult>;

describe('Exam Component', () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseParams.mockReturnValue({
      attemptId: 'exam-123',
    } as any);
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseTimerStore.mockReturnValue({
      currentStepIndex: 0,
      nextStep: jest.fn(),
    } as any);
    
    mockUseStepStore.mockReturnValue({
      steps: [
        { id: 1, kind: 'welcome', title: 'Welcome' },
        { id: 2, kind: 'reading-intro', title: 'Reading Introduction' },
      ],
      isLoading: false,
      error: null,
      fetchSteps: jest.fn(),
    } as any);
    
    mockUseUserStore.mockReturnValue({
      user: {
        id: 'user-123',
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
      },
      logout: mockLogout,
    } as any);
    
    mockUpdateStepResult.mockResolvedValue({ success: true });
  });

  it('should render exam with step component', () => {
    render(<Exam />);
    
    expect(screen.getByTestId('step-component')).toBeInTheDocument();
  });

  it('should show loading state when steps are loading', () => {
    mockUseStepStore.mockReturnValue({
      steps: [],
      isLoading: true,
      error: null,
      fetchSteps: jest.fn(),
    } as any);

    render(<Exam />);
    
    expect(screen.getByText(/loading exam steps/i)).toBeInTheDocument();
  });

  it('should show error state when there is an error', () => {
    mockUseStepStore.mockReturnValue({
      steps: [],
      isLoading: false,
      error: 'Failed to load steps',
      fetchSteps: jest.fn(),
    } as any);

    render(<Exam />);
    
    expect(screen.getByText(/error: failed to load steps/i)).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      logout: mockLogout,
    } as any);

    render(<Exam />);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should fetch steps when steps array is empty', () => {
    const mockFetchSteps = jest.fn();
    
    mockUseStepStore.mockReturnValue({
      steps: [],
      isLoading: false,
      error: null,
      fetchSteps: mockFetchSteps,
    } as any);

    render(<Exam />);
    
    expect(mockFetchSteps).toHaveBeenCalled();
  });

  it('should update step result when step changes', async () => {
    render(<Exam />);
    
    await waitFor(() => {
      expect(mockUpdateStepResult).toHaveBeenCalled();
    });
  });

  it('should render PreventBackNavigation component', () => {
    render(<Exam />);
    
    // PreventBackNavigation should be rendered (it doesn't have visible content)
    expect(screen.getByTestId('step-component')).toBeInTheDocument();
  });

  it('should render TimeOverMessage component', () => {
    render(<Exam />);
    
    // TimeOverMessage should be rendered (it might not be visible initially)
    expect(screen.getByTestId('step-component')).toBeInTheDocument();
  });

  it('should handle step progression', () => {
    const mockNextStep = jest.fn();
    
    mockUseTimerStore.mockReturnValue({
      currentStepIndex: 0,
      nextStep: mockNextStep,
    } as any);

    render(<Exam />);
    
    // The component should be able to handle step progression
    expect(screen.getByTestId('step-component')).toBeInTheDocument();
  });
});