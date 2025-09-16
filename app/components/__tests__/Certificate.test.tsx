import { render, screen } from '@testing-library/react';
import Certificate from '../Certificate';

describe('Certificate Component', () => {
  const mockProps = {
    finalScore: 85,
    cefrLevel: 'B2',
    examDate: '2024-01-15',
    studentName: 'John Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render certificate with all information', () => {
    render(<Certificate {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('should render certificate title', () => {
    render(<Certificate {...mockProps} />);
    
    expect(screen.getByText(/certificate/i)).toBeInTheDocument();
    expect(screen.getByText(/english proficiency/i)).toBeInTheDocument();
  });

  it('should render with different CEFR levels', () => {
    const propsA1 = { ...mockProps, cefrLevel: 'A1' };
    const propsC2 = { ...mockProps, cefrLevel: 'C2' };

    const { rerender } = render(<Certificate {...propsA1} />);
    expect(screen.getByText('A1')).toBeInTheDocument();

    rerender(<Certificate {...propsC2} />);
    expect(screen.getByText('C2')).toBeInTheDocument();
  });

  it('should render with different scores', () => {
    const propsLow = { ...mockProps, finalScore: 45 };
    const propsHigh = { ...mockProps, finalScore: 95 };

    const { rerender } = render(<Certificate {...propsLow} />);
    expect(screen.getByText('45')).toBeInTheDocument();

    rerender(<Certificate {...propsHigh} />);
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  it('should render with different student names', () => {
    const propsJane = { ...mockProps, studentName: 'Jane Smith' };
    const propsBob = { ...mockProps, studentName: 'Bob Johnson' };

    const { rerender } = render(<Certificate {...propsJane} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    rerender(<Certificate {...propsBob} />);
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('should render with different exam dates', () => {
    const propsOld = { ...mockProps, examDate: '2023-12-01' };
    const propsNew = { ...mockProps, examDate: '2024-02-28' };

    const { rerender } = render(<Certificate {...propsOld} />);
    expect(screen.getByText('2023-12-01')).toBeInTheDocument();

    rerender(<Certificate {...propsNew} />);
    expect(screen.getByText('2024-02-28')).toBeInTheDocument();
  });

  it('should render certificate number', () => {
    render(<Certificate {...mockProps} />);
    
    expect(screen.getByText(/certificate number/i)).toBeInTheDocument();
  });

  it('should render completion message', () => {
    render(<Certificate {...mockProps} />);
    
    expect(screen.getByText(/has successfully completed/i)).toBeInTheDocument();
  });

  it('should render CEFR level description', () => {
    render(<Certificate {...mockProps} />);
    
    expect(screen.getByText(/cefr level/i)).toBeInTheDocument();
  });

  it('should render score information', () => {
    render(<Certificate {...mockProps} />);
    
    expect(screen.getByText(/final score/i)).toBeInTheDocument();
  });

  it('should render with minimum required props', () => {
    const minimalProps = {
      finalScore: 50,
      cefrLevel: 'A2',
      examDate: '2024-01-01',
      studentName: 'Test User',
    };

    render(<Certificate {...minimalProps} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
  });
});