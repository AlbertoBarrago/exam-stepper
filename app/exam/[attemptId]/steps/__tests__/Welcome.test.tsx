import { render, screen, fireEvent } from '@testing-library/react';
import Welcome from '../Welcome/Welcome';

describe('Welcome Component', () => {
  const mockOnNextAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render welcome message', () => {
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/english proficiency test/i)).toBeInTheDocument();
  });

  it('should render exam information', () => {
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/50 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/reading/i)).toBeInTheDocument();
    expect(screen.getByText(/listening/i)).toBeInTheDocument();
    expect(screen.getByText(/writing/i)).toBeInTheDocument();
    expect(screen.getByText(/speaking/i)).toBeInTheDocument();
  });

  it('should call onNextAction when start button is clicked', () => {
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);
    
    expect(mockOnNextAction).toHaveBeenCalledTimes(1);
  });

  it('should render instructions', () => {
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/instructions/i)).toBeInTheDocument();
    expect(screen.getByText(/read each question carefully/i)).toBeInTheDocument();
    expect(screen.getByText(/manage your time effectively/i)).toBeInTheDocument();
  });

  it('should render good luck message', () => {
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/good luck/i)).toBeInTheDocument();
  });

  it('should render exam duration information', () => {
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/total time/i)).toBeInTheDocument();
  });

  it('should render section breakdown', () => {
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    // Check for section information
    expect(screen.getByText(/sections/i)).toBeInTheDocument();
  });
});