import { render, screen, fireEvent } from '@testing-library/react';
import WritingTask from '../steps/WritingTask';

describe('WritingTask Component', () => {
  const mockOnNextAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render writing task with title and textarea', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    render(<WritingTask {...props} />);
    
    expect(screen.getByText('Write an essay about your favorite hobby')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle text input', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    render(<WritingTask {...props} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'My favorite hobby is reading books.' } });
    
    expect(textarea).toHaveValue('My favorite hobby is reading books.');
  });

  it('should call onNextAction when next button is clicked', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    render(<WritingTask {...props} />);
    
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    expect(mockOnNextAction).toHaveBeenCalledTimes(1);
  });

  it('should pass written text to onNextAction', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    render(<WritingTask {...props} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'This is my essay content.' } });
    
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    expect(mockOnNextAction).toHaveBeenCalledWith('This is my essay content.');
  });

  it('should show character count', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    render(<WritingTask {...props} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    
    expect(screen.getByText(/11/i)).toBeInTheDocument(); // Character count
  });

  it('should handle empty text', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    render(<WritingTask {...props} />);
    
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    expect(mockOnNextAction).toHaveBeenCalledWith('');
  });

  it('should show word count', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    render(<WritingTask {...props} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello world test' } });
    
    expect(screen.getByText(/3/i)).toBeInTheDocument(); // Word count
  });

  it('should handle long text input', () => {
    const props = {
      title: 'Write an essay about your favorite hobby',
      onNextAction: mockOnNextAction,
    };

    const longText = 'A'.repeat(1000);

    render(<WritingTask {...props} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: longText } });
    
    expect(textarea).toHaveValue(longText);
    expect(screen.getByText(/1000/i)).toBeInTheDocument(); // Character count
  });
});