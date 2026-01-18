import { uploadVehicleLogbook, checkHealth, fetchVehicleData } from '../../src/services/apiServices';
import { describe, expect } from '@jest/globals';


global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('fetchVehicleData', () => {
    it('should fetch vehicle data successfully', async () => {
      const mockResponse = {
        makes: ['Tesla', 'Ford'],
        vehicleData: { Tesla: { 'Model 3': ['Standard'] } },
        quickSelectVehicles: []
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchVehicleData();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/vehicles');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchVehicleData()).rejects.toThrow('Failed to fetch vehicle data');
    });
  });

  describe('uploadVehicleLogbook', () => {
    it('should upload vehicle and logbook successfully', async () => {
      const mockResponse = {
        vehicle: { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
        logbookContents: 'Service log',
        uploadedAt: '2024-01-01',
        filename: 'logbook.txt'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const vehicleData = { make: 'Tesla', model: 'Model 3', badge: 'Performance' };
      const file = new File(['Service log'], 'logbook.txt', { type: 'text/plain' });

      const result = await uploadVehicleLogbook(vehicleData, file);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed upload', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Upload failed' })
      });

      const vehicleData = { make: 'Tesla', model: 'Model 3', badge: 'Performance' };
      const file = new File(['content'], 'logbook.txt', { type: 'text/plain' });

      await expect(uploadVehicleLogbook(vehicleData, file)).rejects.toThrow('Upload failed');
    });
  });

  describe('checkHealth', () => {
    it('should check server health', async () => {
      const mockResponse = { status: 'OK', message: 'Server is running' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await checkHealth();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/health');
      expect(result).toEqual(mockResponse);
    });
  });
});