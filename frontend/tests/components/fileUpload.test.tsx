import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '../../src/components/fileUpload';

describe('FileUpload', () => {
  it('should render file upload component', () => {
    const onFileChange = jest.fn();
    render(<FileUpload file={null} onFileChange={onFileChange} />);

    expect(screen.getByText("Service Logbook (.txt) *")).toBeInTheDocument();
    expect(screen.getByText('Choose a file...')).toBeInTheDocument();
  });

  it('should display filename when file is selected', () => {
    const file = new File(['content'], 'logbook.txt', { type: 'text/plain' });
    const onFileChange = jest.fn();

    render(<FileUpload file={file} onFileChange={onFileChange} />);

    expect(screen.getByText('logbook.txt')).toBeInTheDocument();
  });

  it('should call onFileChange with valid file', () => {
    const onFileChange = jest.fn();
    render(<FileUpload file={null} onFileChange={onFileChange} />);

    const file = new File(['content'], 'logbook.txt', { type: 'text/plain' });
    const input = screen.getByLabelText("Service Logbook (.txt) *");

    expect(input).not.toBeNull();
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false
      });

      fireEvent.change(input);

      expect(onFileChange).toHaveBeenCalledWith(file);
    }
  });

  it('should reject non-text files', () => {
    global.alert = jest.fn();
    const onFileChange = jest.fn();
    render(<FileUpload file={null} onFileChange={onFileChange} />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText("Service Logbook (.txt) *");

    expect(input).not.toBeNull();
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false
      });

      fireEvent.change(input);

      expect(global.alert).toHaveBeenCalledWith('Please select a plain text file (.txt)');
      expect(onFileChange).not.toHaveBeenCalled();
    }
  });
});