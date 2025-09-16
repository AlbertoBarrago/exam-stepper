import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import FinalRecapStep from '../Final/FinalRecapStep';
import { useTimerStore } from '@/state/timerStore';
import { useExamStore } from '@/state/examStore';
import { finalizeExam } from '@/services/api';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/state/timerStore', () => ({
  useTimerStore: jest.fn(),
}));

jest.mock('@/state/examStore', () => ({
  useExamStore: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  finalizeExam: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseTimerStore = useTimerStore as jest.MockedFunction<typeof useTimerStore>;
const mockUseExamStore = useExamStore as jest.MockedFunction<typeof useExamStore>;
const mockFinalizeExam = finalizeExam as jest.MockedFunction<typeof finalizeExam>;

describe('FinalRecapStep Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3000,
      sectionElapsed: {
        reading: 1200,
        listening: 900,
        writing: 1800,
        speaking: 600,
      },
      pause: jest.fn(),
    } as any);
    
    mockUseExamStore.mockReturnValue({
      examId: 123,
    } as any);
    
    mockFinalizeExam.mockResolvedValue({
      success: true,
      finalScore: 85,
      exam: {
        cefr_level: { global_cefr_level: 'B2' },
        final_score: 85,
        created_at: '2024-01-15T00:00:00Z',
      },
    });
  });

  it('should render final recap with exam summary', async () => {
    render(<FinalRecapStep />);
    
    await waitFor(() => {
      expect(screen.getByText(/exam completed/i)).toBeInTheDocument();
      expect(screen.getByText(/final score/i)).toBeInTheDocument();
    });
  });

  it('should display time spent in each section', async () => {
    render(<FinalRecapStep />);
    
    await waitFor(() => {
      expect(screen.getByText(/reading/i)).toBeInTheDocument();
      expect(screen.getByText(/listening/i)).toBeInTheDocument();
      expect(screen.getByText(/writing/i)).toBeInTheDocument();
      expect(screen.getByText(/speaking/i)).toBeInTheDocument();
    });
  });

  it('should call finalizeExam on mount', async () => {
    render(<FinalRecapStep />);
    
    await waitFor(() => {
      expect(mockFinalizeExam).toHaveBeenCalledWith(123);
    });
  });

  it('should display final score and CEFR level', async () => {
    render(<FinalRecapStep />);
    
    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('B2')).toBeInTheDocument();
    });
  });

  it('should handle finalize exam error', async () => {
    mockFinalizeExam.mockResolvedValue({
      success: false,
      error: 'Failed to finalize exam',
    });

    render(<FinalRecapStep />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    render(<FinalRecapStep />);
    
    expect(screen.getByText(/calculating/i)).toBeInTheDocument();
  });

  it('should navigate to results page when view results is clicked', async () => {
    render(<FinalRecapStep />);
    
    await waitFor(() => {
      const viewResultsButton = screen.getByText(/view results/i);
      fireEvent.click(viewResultsButton);
      
      expect(mockPush).toHaveBeenCalledWith('/results');
    });
  });

  it('should pause timer on mount', () => {
    const mockPause = jest.fn();
    
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3000,
      sectionElapsed: {
        reading: 1200,
        listening: 900,
        writing: 1800,
        speaking: 600,
      },
      pause: mockPause,
    } as any);

    render(<FinalRecapStep />);
    
    expect(mockPause).toHaveBeenCalled();
  });

  it('should handle missing examId', async () => {
    mockUseExamStore.mockReturnValue({
      examId: null,
    } as any);

    render(<FinalRecapStep />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should display certificate button when exam is completed', async () => {
    render(<FinalRecapStep />);
    
    await waitFor(() => {
      expect(screen.getByText(/certificate/i)).toBeInTheDocument();
    });
  });

  it('should format time correctly', async () => {
    render(<FinalRecapStep />);
    
    await waitFor(() => {
      // Check if time is displayed in minutes:seconds format
      expect(screen.getByText(/20:00/i)).toBeInTheDocument(); // 1200 seconds = 20:00
      expect(screen.getByText(/15:00/i)).toBeInTheDocument(); // 900 seconds = 15:00
    });
  });
});