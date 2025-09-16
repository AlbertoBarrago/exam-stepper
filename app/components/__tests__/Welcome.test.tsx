import { render, screen, fireEvent } from '@testing-library/react';
import Welcome from '../Welcome';

describe('Welcome Component', () => {
  it('should render welcome message', () => {
    const mockOnNextAction = jest.fn();
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/english proficiency test/i)).toBeInTheDocument();
  });

  it('should render exam information', () => {
    const mockOnNextAction = jest.fn();
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/50 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/reading/i)).toBeInTheDocument();
    expect(screen.getByText(/listening/i)).toBeInTheDocument();
    expect(screen.getByText(/writing/i)).toBeInTheDocument();
    expect(screen.getByText(/speaking/i)).toBeInTheDocument();
  });

  it('should call onNextAction when start button is clicked', () => {
    const mockOnNextAction = jest.fn();
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);
    
    expect(mockOnNextAction).toHaveBeenCalledTimes(1);
  });

  it('should render instructions', () => {
    const mockOnNextAction = jest.fn();
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/instructions/i)).toBeInTheDocument();
    expect(screen.getByText(/read each question carefully/i)).toBeInTheDocument();
    expect(screen.getByText(/manage your time effectively/i)).toBeInTheDocument();
  });

  it('should render good luck message', () => {
    const mockOnNextAction = jest.fn();
    render(<Welcome onNextAction={mockOnNextAction} />);
    
    expect(screen.getByText(/good luck/i)).toBeInTheDocument();
  });
});