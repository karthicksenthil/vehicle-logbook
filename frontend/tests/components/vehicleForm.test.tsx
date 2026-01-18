import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleForm } from '../../src/components/vehicleForm';
import * as apiService from '../../src/services/apiServices';

jest.mock('../../src/services/apiServices');

describe('VehicleForm', () => {
  const mockVehicleData = {
    makes: ['Ford', 'Tesla', 'BMW'],
    vehicleData: {
      Tesla: {
        'Model 3': ['Standard', 'Performance', 'Dual Motor']
      },
      Ford: {
        Ranger: ['Wildtrak', 'Raptor' , 'Raptor X']
      }
    },
    quickSelectVehicles: [
      { make: 'Tesla', model: 'Model 3', badge: 'Performance', label: 'Tesla Model 3 Performance' },
      { make: 'Ford', model: 'Ranger', badge: 'Wildtrak', label: 'Ford Ranger Wildtrak' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.fetchVehicleData as jest.Mock).mockResolvedValue(mockVehicleData);
  });

  it('should show loading state then render form after data loads', async () => {
    render(<VehicleForm />);

    // Should show loading initially
    expect(screen.getByText(/Loading vehicle data.../i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // Verify form elements are rendered
    expect(screen.getByLabelText("Make *")).toBeInTheDocument();
    expect(screen.getByLabelText("Model *")).toBeInTheDocument();
    expect(screen.getByLabelText("Badge *")).toBeInTheDocument();
    // expect(screen.getByText('Submit')).toBeInTheDocument();

    // Verify API was called
    expect(apiService.fetchVehicleData).toHaveBeenCalledTimes(1);
  });

  it('should show alert when submitting incomplete form', async () => {
    const user = userEvent.setup();
    global.alert = jest.fn();
    render(<VehicleForm />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/Make/i), 'Tesla');
    await user.selectOptions(screen.getByLabelText(/Model/i), 'Model 3');
    await user.selectOptions(screen.getByLabelText(/Badge/i), 'Performance');

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Please complete all fields and upload a logbook file');
  });

  it('should submit form successfully with all required fields', async () => {
    const user = userEvent.setup();
    const mockUploadResponse = {
      vehicle: { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
      logbookContents: 'Service log content',
      uploadedAt: '2026-01-10',
      filename: 'logbook.txt'
    };

    (apiService.uploadVehicleLogbook as jest.Mock).mockResolvedValue(mockUploadResponse);

    render(<VehicleForm />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // Fill out form
    await user.selectOptions(screen.getByLabelText(/Make/i), 'Tesla');
    await user.selectOptions(screen.getByLabelText(/Model/i), 'Model 3');
    await user.selectOptions(screen.getByLabelText(/Badge/i), 'Performance');

    // Upload file
    const file = new File(['Service log content'], 'logbook.txt', { type: 'text/plain' });
    const input = screen.getByLabelText("Service Logbook (.txt) *");

    if (input) {
      Object.defineProperty(input, 'files', { 
        value: [file], 
        writable: false 
      });
      fireEvent.change(input);
    }

    // Submit form
    const submitButton = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    expect(global.alert).not.toHaveBeenCalledWith('Please complete all fields and upload a logbook file');

    // Wait for upload to complete
    await waitFor(() => {
      expect(apiService.uploadVehicleLogbook).toHaveBeenCalledWith(
        { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
        file
      );
    });

    // Verify response is displayed
    await waitFor(() => {
      expect(screen.getByText('Service log content')).toBeInTheDocument();
    });
  });

  it('should handle upload error gracefully', async () => {
    const user = userEvent.setup();
    (apiService.uploadVehicleLogbook as jest.Mock).mockRejectedValue(
      new Error('Upload failed: Server error')
    );

    render(<VehicleForm />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // Fill form and submit
    await user.selectOptions(screen.getByLabelText(/Make/i), 'Tesla');
    await user.selectOptions(screen.getByLabelText(/Model/i), 'Model 3');
    await user.selectOptions(screen.getByLabelText(/Badge/i), 'Performance');

    const file = new File(['content'], 'logbook.txt', { type: 'text/plain' });
    const input = screen.getByLabelText("Service Logbook (.txt) *");
    
    if (input) {
      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);
    }

    fireEvent.click(screen.getByText('Submit'));

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Upload failed: Server error/i)).toBeInTheDocument();
    });
  });

  it('should handle quick select button click', async () => {
    const user = userEvent.setup();
    render(<VehicleForm />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // Click quick select button
    const teslaButton = screen.getByText('Tesla Model 3 Performance');
    await user.click(teslaButton);

    // Verify selections were made
    await waitFor(() => {
      expect(screen.getByLabelText(/Make/i)).toHaveValue('Tesla');
      expect(screen.getByLabelText(/Model/i)).toHaveValue('Model 3');
      expect(screen.getByLabelText(/Badge/i)).toHaveValue('Performance');
    });
  });

  it('should handle API data loading failure', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    (apiService.fetchVehicleData as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch vehicle data')
    );

    render(<VehicleForm />);

    // Should show loading initially
    expect(screen.getByText(/Loading vehicle data.../i)).toBeInTheDocument();

    // Wait for loading to complete (even though it failed)
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // Form should render but with empty data
    expect(screen.getByLabelText(/Make/i)).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('should render quick select buttons from API data', async () => {
    render(<VehicleForm />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // Verify quick select buttons from API are rendered
    expect(screen.getByText('Tesla Model 3 Performance')).toBeInTheDocument();
    expect(screen.getByText('Ford Ranger Wildtrak')).toBeInTheDocument();
  });

  it('should populate dropdowns with data from API', async () => {
    const user = userEvent.setup();
    render(<VehicleForm />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // Check make dropdown has options from API
    const makeSelect = screen.getByLabelText(/Make/i);
    await user.click(makeSelect);
    
    expect(screen.getByRole('option', { name: 'Tesla' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ford' })).toBeInTheDocument();
  });

  it('should clear previous response when submitting new form', async () => {
    const user = userEvent.setup();
    const mockResponse1 = {
      vehicle: { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
      logbookContents: 'First upload',
      uploadedAt: '2024-01-01',
      filename: 'log1.txt'
    };
    const mockResponse2 = {
      vehicle: { make: 'Ford', model: 'Ranger', badge: 'Wildtrak' },
      logbookContents: 'Second upload',
      uploadedAt: '2024-01-02',
      filename: 'log2.txt'
    };

    (apiService.uploadVehicleLogbook as jest.Mock)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    render(<VehicleForm />);

    // Wait for loading
    await waitFor(() => {
      expect(screen.getByText('Vehicle Logbook Upload')).toBeInTheDocument();
    });

    // First upload
    await user.selectOptions(screen.getByLabelText(/Make/i), 'Tesla');
    await user.selectOptions(screen.getByLabelText(/Model/i), 'Model 3');
    await user.selectOptions(screen.getByLabelText(/Badge/i), 'Performance');

    const file1 = new File(['First upload'], 'log1.txt', { type: 'text/plain' });
    const input = screen.getByLabelText("Service Logbook (.txt) *");
    
    if (input) {
      Object.defineProperty(input, 'files', { value: [file1], writable: false, configurable: true });
      fireEvent.change(input);
    }

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('First upload')).toBeInTheDocument();
    });

    // Second upload - response should be cleared during submission
    await user.selectOptions(screen.getByLabelText(/Make/i), 'Ford');
    await user.selectOptions(screen.getByLabelText(/Model/i), 'Ranger');
    await user.selectOptions(screen.getByLabelText(/Badge/i), 'Wildtrak');

    const file2 = new File(['Second upload'], 'log2.txt', { type: 'text/plain' });
    if (input) {
      Object.defineProperty(input, 'files', { value: [file2], writable: false, configurable: true });
      fireEvent.change(input);
    }

    fireEvent.click(screen.getByText('Submit'));

    // Old response should be cleared, new one should appear
    await waitFor(() => {
      expect(screen.getByText('Second upload')).toBeInTheDocument();
    });
  });
});