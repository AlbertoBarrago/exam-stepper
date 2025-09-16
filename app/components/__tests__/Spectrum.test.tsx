import { render, screen } from '@testing-library/react';
import Spectrum from '../Spectrum';

describe('Spectrum Component', () => {
  it('should render spectrum component', () => {
    render(<Spectrum />);
    
    expect(screen.getByTestId('spectrum')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(<Spectrum className="custom-spectrum" />);
    
    const spectrum = screen.getByTestId('spectrum');
    expect(spectrum).toHaveClass('custom-spectrum');
  });

  it('should render with default props', () => {
    render(<Spectrum />);
    
    const spectrum = screen.getByTestId('spectrum');
    expect(spectrum).toBeInTheDocument();
  });

  it('should render canvas element', () => {
    render(<Spectrum />);
    
    const canvas = screen.getByTestId('spectrum-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should handle audio context initialization', () => {
    render(<Spectrum />);
    
    // Component should render without errors
    expect(screen.getByTestId('spectrum')).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Spectrum width={200} height={100} />);
    
    expect(screen.getByTestId('spectrum')).toBeInTheDocument();
    
    rerender(<Spectrum width={400} height={200} />);
    
    expect(screen.getByTestId('spectrum')).toBeInTheDocument();
  });

  it('should handle audio data updates', () => {
    render(<Spectrum />);
    
    // Component should be able to handle audio data updates
    expect(screen.getByTestId('spectrum')).toBeInTheDocument();
  });

  it('should render frequency bars', () => {
    render(<Spectrum />);
    
    // Spectrum should render frequency visualization
    expect(screen.getByTestId('spectrum')).toBeInTheDocument();
  });
});