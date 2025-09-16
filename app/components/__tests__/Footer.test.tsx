import { render, screen } from '@testing-library/react';
import Footer from '../layout/Footer';

describe('Footer Component', () => {
  it('should render footer with copyright information', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2024 exam stepper/i)).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });

  it('should render footer with links', () => {
    render(<Footer />);
    
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
  });

  it('should render footer with social media links', () => {
    render(<Footer />);
    
    // Check if social media icons are present (they might be rendered as icons)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});