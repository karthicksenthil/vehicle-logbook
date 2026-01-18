import { VehicleData, ValidationResult } from '../types';

/**
 * Validates vehicle data
 */
export function validateVehicleData(data: Partial<VehicleData>): ValidationResult {
  const errors: string[] = [];
  
  if (!data.make || typeof data.make !== 'string' || data.make.trim() === '') {
    errors.push('Make is required and must be a non-empty string');
  }
  
  if (!data.model || typeof data.model !== 'string' || data.model.trim() === '') {
    errors.push('Model is required and must be a non-empty string');
  }
  
  if (!data.badge || typeof data.badge !== 'string' || data.badge.trim() === '') {
    errors.push('Badge is required and must be a non-empty string');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates file object
 */
export function validateFile(file: Express.Multer.File | undefined): ValidationResult {
  const errors: string[] = [];
  
  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }
  
  if (file.mimetype !== 'text/plain') {
    errors.push('File must be a plain text file (.txt)');
  }
  
  if (!file.buffer || file.buffer.length === 0) {
    errors.push('File is empty');
  }
  
  // Max file size: 5MB
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('File size exceeds 5MB limit');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}