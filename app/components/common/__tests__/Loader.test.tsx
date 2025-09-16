import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader Component', () => {
  it('should render with default message', () => {
    render(<Loader />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    const customMessage = 'Loading exam data...';
    render(<Loader message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should render spinner', () => {
    render(<Loader />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<Loader message="Loading..." />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });
});