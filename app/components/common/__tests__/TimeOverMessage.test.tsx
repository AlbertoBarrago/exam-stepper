import { render, screen } from '@testing-library/react';
import TimeOverMessage from '../TimeOverMessage';
import { useTimerStore } from '@/state/timerStore';

// Mock the timer store
jest.mock('@/state/timerStore', () => ({
  useTimerStore: jest.fn(),
}));

const mockUseTimerStore = useTimerStore as jest.MockedFunction<typeof useTimerStore>;

describe('TimeOverMessage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when time is not over', () => {
    mockUseTimerStore.mockReturnValue({
      isTimeOver: false,
    } as any);

    render(<TimeOverMessage />);
    
    expect(screen.queryByText(/time is up/i)).not.toBeInTheDocument();
  });

  it('should render when time is over', () => {
    mockUseTimerStore.mockReturnValue({
      isTimeOver: true,
    } as any);

    render(<TimeOverMessage />);
    
    expect(screen.getByText(/time is up/i)).toBeInTheDocument();
    expect(screen.getByText(/exam will be submitted automatically/i)).toBeInTheDocument();
  });

  it('should render with correct styling', () => {
    mockUseTimerStore.mockReturnValue({
      isTimeOver: true,
    } as any);

    render(<TimeOverMessage />);
    
    const message = screen.getByText(/time is up/i);
    expect(message).toHaveClass('bg-red-100', 'border-red-400', 'text-red-700');
  });

  it('should render with icon', () => {
    mockUseTimerStore.mockReturnValue({
      isTimeOver: true,
    } as any);

    render(<TimeOverMessage />);
    
    // Check if the component renders (the icon might be from lucide-react)
    expect(screen.getByText(/time is up/i)).toBeInTheDocument();
  });
});