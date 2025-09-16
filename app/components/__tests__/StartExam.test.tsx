import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import StartExam from '../StartExam';
import { useUserStore } from '@/state/userStore';
import { useStepStore } from '@/state/stepStore';
import { startExam } from '@/services/api';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/state/userStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('@/state/stepStore', () => ({
  useStepStore: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  startExam: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
const mockUseStepStore = useStepStore as jest.MockedFunction<typeof useStepStore>;
const mockStartExam = startExam as jest.MockedFunction<typeof startExam>;

// Mock examStore
const mockUseExamStore = jest.fn();
jest.mock('@/state/examStore', () => ({
  useExamStore: mockUseExamStore,
}));

describe('StartExam Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseExamStore.mockReturnValue({
      setExamId: jest.fn(),
    } as any);
  });

  it('should render start exam button', () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    const mockSteps = [
      { id: 1, kind: 'welcome', title: 'Welcome' },
      { id: 2, kind: 'reading-intro', title: 'Reading Introduction' },
    ];

    mockUseUserStore.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      loading: false,
      error: null,
    } as any);

    mockUseStepStore.mockReturnValue({
      steps: mockSteps,
      isLoading: false,
      error: null,
    } as any);

    render(<StartExam />);
    
    expect(screen.getByText(/start exam/i)).toBeInTheDocument();
  });

  it('should handle start exam successfully', async () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    const mockSteps = [
      { id: 1, kind: 'welcome', title: 'Welcome' },
      { id: 2, kind: 'reading-intro', title: 'Reading Introduction' },
    ];

    mockUseUserStore.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      loading: false,
      error: null,
    } as any);

    mockUseStepStore.mockReturnValue({
      steps: mockSteps,
      isLoading: false,
      error: null,
    } as any);

    mockStartExam.mockResolvedValueOnce({
      success: true,
      examId: 123,
      examSteps: [],
    });

    render(<StartExam />);
    
    const startButton = screen.getByText(/start exam/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(mockStartExam).toHaveBeenCalledWith('user-123', [1, 2]);
      expect(mockPush).toHaveBeenCalledWith('/exam/123');
    });
  });

  it('should handle start exam failure', async () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    const mockSteps = [
      { id: 1, kind: 'welcome', title: 'Welcome' },
    ];

    mockUseUserStore.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      loading: false,
      error: null,
    } as any);

    mockUseStepStore.mockReturnValue({
      steps: mockSteps,
      isLoading: false,
      error: null,
    } as any);

    mockStartExam.mockResolvedValueOnce({
      success: false,
      error: 'Failed to start exam',
    });

    render(<StartExam />);
    
    const startButton = screen.getByText(/start exam/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to start exam')).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    mockUseUserStore.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      loading: false,
      error: null,
    } as any);

    mockUseStepStore.mockReturnValue({
      steps: [],
      isLoading: true,
      error: null,
    } as any);

    render(<StartExam />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    mockUseUserStore.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      loading: false,
      error: null,
    } as any);

    mockUseStepStore.mockReturnValue({
      steps: [],
      isLoading: false,
      error: 'Failed to load steps',
    } as any);

    render(<StartExam />);
    
    expect(screen.getByText('Failed to load steps')).toBeInTheDocument();
  });

  it('should redirect to login when no user', () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      setUser: jest.fn(),
      loading: false,
      error: null,
    } as any);

    render(<StartExam />);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});