import { VehicleData, UploadResponse, VehicleDataResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetch vehicle data from server
 */
export async function fetchVehicleData(): Promise<VehicleDataResponse> {
  const response = await fetch(`${API_BASE_URL}/vehicles`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch vehicle data');
  }
  
  return response.json();
}

/**
 * Upload vehicle and logbook to server
 */
export async function uploadVehicleLogbook(
  vehicleData: VehicleData,
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('make', vehicleData.make);
  formData.append('model', vehicleData.model);
  formData.append('badge', vehicleData.badge);
  formData.append('logbook', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

/**
 * Check server health
 */
export async function checkHealth(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}