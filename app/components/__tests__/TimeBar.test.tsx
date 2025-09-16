import { render, screen } from '@testing-library/react';
import TimeBar from '../TimeBar';
import { useTimerStore } from '@/state/timerStore';

// Mock the timer store
jest.mock('@/state/timerStore', () => ({
  useTimerStore: jest.fn(),
}));

const mockUseTimerStore = useTimerStore as jest.MockedFunction<typeof useTimerStore>;

describe('TimeBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render time bar with global time', () => {
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3000,
      sectionTimeLeft: 0,
      currentSection: null,
      isRunning: false,
      isTimeOver: false,
    } as any);

    render(<TimeBar />);
    
    expect(screen.getByText(/global time/i)).toBeInTheDocument();
    expect(screen.getByText(/50:00/i)).toBeInTheDocument();
  });

  it('should render time bar with section time', () => {
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3000,
      sectionTimeLeft: 600,
      currentSection: 'reading',
      isRunning: true,
      isTimeOver: false,
    } as any);

    render(<TimeBar />);
    
    expect(screen.getByText(/reading/i)).toBeInTheDocument();
    expect(screen.getByText(/10:00/i)).toBeInTheDocument();
  });

  it('should show running state', () => {
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3000,
      sectionTimeLeft: 600,
      currentSection: 'reading',
      isRunning: true,
      isTimeOver: false,
    } as any);

    render(<TimeBar />);
    
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });

  it('should show paused state', () => {
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3000,
      sectionTimeLeft: 600,
      currentSection: 'reading',
      isRunning: false,
      isTimeOver: false,
    } as any);

    render(<TimeBar />);
    
    expect(screen.getByText(/paused/i)).toBeInTheDocument();
  });

  it('should show time over state', () => {
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3000,
      sectionTimeLeft: 0,
      currentSection: 'reading',
      isRunning: false,
      isTimeOver: true,
    } as any);

    render(<TimeBar />);
    
    expect(screen.getByText(/time over/i)).toBeInTheDocument();
  });

  it('should format time correctly', () => {
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 3661, // 1 hour, 1 minute, 1 second
      sectionTimeLeft: 0,
      currentSection: null,
      isRunning: false,
      isTimeOver: false,
    } as any);

    render(<TimeBar />);
    
    expect(screen.getByText(/1:01:01/i)).toBeInTheDocument();
  });

  it('should handle zero time', () => {
    mockUseTimerStore.mockReturnValue({
      globalTimeLeft: 0,
      sectionTimeLeft: 0,
      currentSection: null,
      isRunning: false,
      isTimeOver: false,
    } as any);

    render(<TimeBar />);
    
    expect(screen.getByText(/0:00/i)).toBeInTheDocument();
  });
});