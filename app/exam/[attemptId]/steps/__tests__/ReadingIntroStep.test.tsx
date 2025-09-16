import { render, screen, fireEvent } from '@testing-library/react';
import ReadingIntroStep from '../Reading/ReadingIntroStep';

describe('ReadingIntroStep Component', () => {
  const mockOnNextAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render reading intro with title and subtitle', () => {
    const props = {
      title: 'Reading Section',
      subtitle: 'Read the passage and answer the questions',
      durationMs: 300000, // 5 minutes
      kind: 'reading-intro',
      onNextAction: mockOnNextAction,
    };

    render(<ReadingIntroStep {...props} />);
    
    expect(screen.getByText('Reading Section')).toBeInTheDocument();
    expect(screen.getByText('Read the passage and answer the questions')).toBeInTheDocument();
  });

  it('should display duration in minutes', () => {
    const props = {
      title: 'Reading Section',
      subtitle: 'Read the passage and answer the questions',
      durationMs: 300000, // 5 minutes
      kind: 'reading-intro',
      onNextAction: mockOnNextAction,
    };

    render(<ReadingIntroStep {...props} />);
    
    expect(screen.getByText(/5 minutes/i)).toBeInTheDocument();
  });

  it('should call onNextAction when start button is clicked', () => {
    const props = {
      title: 'Reading Section',
      subtitle: 'Read the passage and answer the questions',
      durationMs: 300000,
      kind: 'reading-intro',
      onNextAction: mockOnNextAction,
    };

    render(<ReadingIntroStep {...props} />);
    
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);
    
    expect(mockOnNextAction).toHaveBeenCalledTimes(1);
  });

  it('should handle different durations', () => {
    const props = {
      title: 'Reading Section',
      subtitle: 'Read the passage and answer the questions',
      durationMs: 600000, // 10 minutes
      kind: 'reading-intro',
      onNextAction: mockOnNextAction,
    };

    render(<ReadingIntroStep {...props} />);
    
    expect(screen.getByText(/10 minutes/i)).toBeInTheDocument();
  });

  it('should render without subtitle', () => {
    const props = {
      title: 'Reading Section',
      durationMs: 300000,
      kind: 'reading-intro',
      onNextAction: mockOnNextAction,
    };

    render(<ReadingIntroStep {...props} />);
    
    expect(screen.getByText('Reading Section')).toBeInTheDocument();
  });

  it('should render with zero duration', () => {
    const props = {
      title: 'Reading Section',
      subtitle: 'Read the passage and answer the questions',
      durationMs: 0,
      kind: 'reading-intro',
      onNextAction: mockOnNextAction,
    };

    render(<ReadingIntroStep {...props} />);
    
    expect(screen.getByText(/0 minutes/i)).toBeInTheDocument();
  });

  it('should render instructions', () => {
    const props = {
      title: 'Reading Section',
      subtitle: 'Read the passage and answer the questions',
      durationMs: 300000,
      kind: 'reading-intro',
      onNextAction: mockOnNextAction,
    };

    render(<ReadingIntroStep {...props} />);
    
    expect(screen.getByText(/instructions/i)).toBeInTheDocument();
  });
});