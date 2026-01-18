import { render, screen } from '@testing-library/react';
import { ResponseDisplay } from '../../src/components/responseDisplay';

describe('ResponseDisplay', () => {
  it('should render nothing when no response', () => {
    const { container } = render(<ResponseDisplay response={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display error message', () => {
    const response = { error: 'Upload failed' };
    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('should display successful response', () => {
    const response = {
      vehicle: {
        make: 'Tesla',
        model: 'Model 3',
        badge: 'Performance'
      },
      logbookContents: 'Service log content',
      filename: 'logbook.txt',
      uploadedAt: '2024-01-01T00:00:00Z'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText("Tesla")).toBeInTheDocument();
    expect(screen.getByText("Model 3")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText('Service log content')).toBeInTheDocument();
  });

  it('should display server response header', () => {
    const response = {
      vehicle: { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
      logbookContents: 'content',
      filename: 'logbook.txt',
      uploadedAt: '2024-01-01T00:00:00Z'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Server Response:')).toBeInTheDocument();
  });
});