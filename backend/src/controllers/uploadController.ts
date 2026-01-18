import { Request, Response } from 'express';
import { validateVehicleData, validateFile } from '../utils/validators';
import { UploadResponse, HealthCheckResponse } from '../types';

/**
 * Handles vehicle logbook upload
 */
export async function handleUpload(req: Request, res: Response): Promise<void> {
  try {
    const { make, model, badge } = req.body;
    
    // Validate vehicle data
    const vehicleValidation = validateVehicleData({ make, model, badge });
    if (!vehicleValidation.isValid) {
      res.status(400).json({
        error: 'Validation failed',
        details: vehicleValidation.errors
      });
      return;
    }
    
    // Validate file
    const fileValidation = validateFile(req.file);
    if (!fileValidation.isValid) {
      res.status(400).json({
        error: 'File validation failed',
        details: fileValidation.errors
      });
      return;
    }
    
    // Read logbook contents
    const logbookContents = req.file!.buffer.toString('utf-8');
    
    // Prepare response
    const response: UploadResponse = {
      vehicle: {
        make: make.trim(),
        model: model.trim(),
        badge: badge.trim()
      },
      logbookContents,
      uploadedAt: new Date().toISOString(),
      filename: req.file!.originalname
    };
    
    // Log for server-side verification
    console.log('\n=== Vehicle Logbook Upload ===');
    console.log('Vehicle:', response.vehicle);
    console.log('Filename:', response.filename);
    console.log('Logbook Preview:', logbookContents.substring(0, 100) + '...');
    console.log('==============================\n');
    
    res.json(response);
    
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({
      error: 'Server error processing upload'
    });
  }
}

/**
 * Health check endpoint
 */
export function healthCheck(req: Request, res: Response): void {
  const response: HealthCheckResponse = {
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
}