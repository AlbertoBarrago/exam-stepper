import { render, screen, fireEvent } from '@testing-library/react';
import StartButton from '../StartButton';

describe('StartButton Component', () => {
  const mockHandleStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render start button', () => {
    render(<StartButton handleStart={mockHandleStart} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call handleStart when button is clicked', () => {
    render(<StartButton handleStart={mockHandleStart} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockHandleStart).toHaveBeenCalledTimes(1);
  });

  it('should render with custom text', () => {
    render(<StartButton handleStart={mockHandleStart} text="Begin Exam" />);
    
    expect(screen.getByText('Begin Exam')).toBeInTheDocument();
  });

  it('should render with default text', () => {
    render(<StartButton handleStart={mockHandleStart} />);
    
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<StartButton handleStart={mockHandleStart} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be enabled when disabled prop is false', () => {
    render(<StartButton handleStart={mockHandleStart} disabled={false} />);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should not call handleStart when disabled', () => {
    render(<StartButton handleStart={mockHandleStart} disabled={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockHandleStart).not.toHaveBeenCalled();
  });

  it('should render with custom className', () => {
    render(<StartButton handleStart={mockHandleStart} className="custom-button" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button');
  });

  it('should render with loading state', () => {
    render(<StartButton handleStart={mockHandleStart} loading={true} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should not call handleStart when loading', () => {
    render(<StartButton handleStart={mockHandleStart} loading={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockHandleStart).not.toHaveBeenCalled();
  });
});