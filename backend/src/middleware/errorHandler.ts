import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);
  
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: 'File size exceeds 5MB limit'
      });
      return;
    }
    res.status(400).json({
      error: err.message
    });
    return;
  }
  
  // Custom file filter errors
  if (err.message === 'Only .txt files are allowed') {
    res.status(400).json({
      error: err.message
    });
    return;
  }
  
  // Generic error
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
}