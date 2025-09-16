import { render, screen, fireEvent } from '@testing-library/react';
import ReadingQuestionStep from '../Reading/ReadingQuestionStep';

describe('ReadingQuestionStep Component', () => {
  const mockOnNextAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render reading question with sentence and options', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    expect(screen.getByText('What is the main idea of the passage?')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
    expect(screen.getByText('Option D')).toBeInTheDocument();
  });

  it('should handle option selection', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    const optionA = screen.getByText('Option A');
    fireEvent.click(optionA);
    
    expect(optionA).toHaveClass('bg-blue-500', 'text-white');
  });

  it('should call onNextAction when next button is clicked', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    expect(mockOnNextAction).toHaveBeenCalledTimes(1);
  });

  it('should disable next button when no option is selected', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    const nextButton = screen.getByText(/next/i);
    expect(nextButton).toBeDisabled();
  });

  it('should enable next button when option is selected', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    const optionA = screen.getByText('Option A');
    fireEvent.click(optionA);
    
    const nextButton = screen.getByText(/next/i);
    expect(nextButton).not.toBeDisabled();
  });

  it('should pass selected option to onNextAction', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    const optionB = screen.getByText('Option B');
    fireEvent.click(optionB);
    
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    expect(mockOnNextAction).toHaveBeenCalledWith('Option B');
  });

  it('should handle empty options array', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: [],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    expect(screen.getByText('What is the main idea of the passage?')).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeDisabled();
  });

  it('should handle single option', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Only Option'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    expect(screen.getByText('Only Option')).toBeInTheDocument();
    
    const option = screen.getByText('Only Option');
    fireEvent.click(option);
    
    const nextButton = screen.getByText(/next/i);
    expect(nextButton).not.toBeDisabled();
  });

  it('should deselect previous option when new option is selected', () => {
    const props = {
      sentence: 'What is the main idea of the passage?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      onNextAction: mockOnNextAction,
    };

    render(<ReadingQuestionStep {...props} />);
    
    const optionA = screen.getByText('Option A');
    const optionB = screen.getByText('Option B');
    
    fireEvent.click(optionA);
    expect(optionA).toHaveClass('bg-blue-500', 'text-white');
    
    fireEvent.click(optionB);
    expect(optionA).not.toHaveClass('bg-blue-500', 'text-white');
    expect(optionB).toHaveClass('bg-blue-500', 'text-white');
  });
});