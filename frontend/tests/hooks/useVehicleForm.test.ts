import { renderHook, act, waitFor } from '@testing-library/react';
import { useVehicleForm } from '../../src/hooks/useVehicleForm';
import * as apiService from '../../src/services/apiServices';

jest.mock('../../src/services/apiServices');

describe('useVehicleForm', () => {
  const mockVehicleData = {
    makes: ['Tesla', 'Ford'],
    vehicleData: {
      Tesla: {
        'Model 3': ['Standard', 'Performance']
      },
      Ford: {
        'Ranger': ['XL', 'XLT']
      }
    },
    quickSelectVehicles: [
      { make: 'Tesla', model: 'Model 3', badge: 'Performance', label: 'Tesla Model 3 Performance' }
    ]
  };

  beforeEach(() => {
    (apiService.fetchVehicleData as jest.Mock).mockResolvedValue(mockVehicleData);
  });

  it('should initialize with empty values and load data', async () => {
    const { result } = renderHook(() => useVehicleForm());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.make).toBe('');
    expect(result.current.model).toBe('');
    expect(result.current.badge).toBe('');
    expect(result.current.file).toBe(null);
  });

  it('should update make and clear model and badge', async () => {
    const { result } = renderHook(() => useVehicleForm());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleMakeChange('Tesla');
      result.current.handleModelChange('Model 3');
      result.current.handleBadgeChange('Performance');
    });

    expect(result.current.make).toBe('Tesla');
    expect(result.current.model).toBe('Model 3');
    expect(result.current.badge).toBe('Performance');

    act(() => {
      result.current.handleMakeChange('Ford');
    });

    expect(result.current.make).toBe('Ford');
    expect(result.current.model).toBe('');
    expect(result.current.badge).toBe('');
  });

  it('should handle quick select', async () => {
    const { result } = renderHook(() => useVehicleForm());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const vehicle = { make: 'Tesla', model: 'Model 3', badge: 'Performance', label: 'Test' };

    act(() => {
      result.current.handleQuickSelect(vehicle);
    });

    expect(result.current.make).toBe('Tesla');
    expect(result.current.model).toBe('Model 3');
    expect(result.current.badge).toBe('Performance');
  });

  it('should validate form correctly', async () => {
    const { result } = renderHook(() => useVehicleForm());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isValid()).toBe(false);

    act(() => {
      result.current.handleMakeChange('Tesla');
      result.current.handleModelChange('Model 3');
      result.current.handleBadgeChange('Performance');
      result.current.handleFileChange(new File(['content'], 'test.txt', { type: 'text/plain' }));
    });

    expect(result.current.isValid()).toBe(true);
  });
});