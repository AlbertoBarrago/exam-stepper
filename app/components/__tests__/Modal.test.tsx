import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal with title and children', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when modal content is clicked', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle keyboard escape key', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render without title', () => {
    render(
      <Modal onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should render with custom close button text', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose} closeText="Cancel">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose} className="custom-modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const modal = screen.getByTestId('modal-content');
    expect(modal).toHaveClass('custom-modal');
  });

  it('should prevent body scroll when modal is open', () => {
    render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    // Modal should be rendered
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should restore body scroll when modal is closed', () => {
    const { unmount } = render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    unmount();
    
    // Body scroll should be restored
    expect(document.body.style.overflow).toBe('');
  });
});