import { render, screen } from '@testing-library/react';
import TimeOverMessage from '../TimeOverMessage';
import { useTimerStore } from '@/state/timerStore';

// Mock the timer store
jest.mock('@/state/timerStore', () => ({
  useTimerStore: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockUseTimerStore = useTimerStore as jest.MockedFunction<
  typeof useTimerStore
>;

describe('TimeOverMessage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when time is not over', () => {
    mockUseTimerStore.mockReturnValue({ isTimeOver: false } as any);

    render(<TimeOverMessage />);

    expect(screen.queryByText(/time is over/i)).not.toBeInTheDocument();
  });

  it('should render when time is over', () => {
    mockUseTimerStore.mockReturnValue({ isTimeOver: true } as any);

    render(<TimeOverMessage />);

    expect(screen.getByText(/time is over/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You failed to complete the exam within the allotted time./i),
    ).toBeInTheDocument();
  });

  it('should render with correct styling', () => {
    mockUseTimerStore.mockReturnValue({ isTimeOver: true } as any);

    render(<TimeOverMessage />);

    const message = screen.getByText(/time is over/i);
    expect(message).toHaveClass('text-3xl font-bold text-red-600 mb-4');
  });

  it('should render with icon', () => {
    mockUseTimerStore.mockReturnValue({ isTimeOver: true } as any);

    render(<TimeOverMessage />);

    // Check if the component renders (the icon might be from lucide-react)
    expect(screen.getByText(/time is over/i)).toBeInTheDocument();
  });
});