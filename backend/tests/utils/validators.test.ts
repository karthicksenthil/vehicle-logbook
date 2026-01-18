import { validateVehicleData, validateFile } from '../../src/utils/validators';

describe('Validators', () => {
  describe('validateVehicleData', () => {
    it('should validate correct vehicle data', () => {
      const data = { make: 'Tesla', model: 'Model 3', badge: 'Performance' };
      const result = validateVehicleData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing make', () => {
      const data = { model: 'Model 3', badge: 'Performance' };
      const result = validateVehicleData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Make is required and must be a non-empty string');
    });

    it('should reject empty make', () => {
      const data = { make: '  ', model: 'Model 3', badge: 'Performance' };
      const result = validateVehicleData(data);
      expect(result.isValid).toBe(false);
    });

    it('should reject missing model', () => {
      const data = { make: 'Tesla', badge: 'Performance' };
      const result = validateVehicleData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Model is required and must be a non-empty string');
    });

    it('should reject missing badge', () => {
      const data = { make: 'Tesla', model: 'Model 3' };
      const result = validateVehicleData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Badge is required and must be a non-empty string');
    });

    it('should reject non-string values', () => {
      const data = { make: 123 as any, model: true as any, badge: {} as any };
      const result = validateVehicleData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateFile', () => {
    it('should validate correct file', () => {
      const file = {
        mimetype: 'text/plain',
        buffer: Buffer.from('Service log content'),
        size: 1000
      } as Express.Multer.File;
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing file', () => {
      const result = validateFile(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File is required');
    });

    it('should reject wrong mimetype', () => {
      const file = {
        mimetype: 'application/pdf',
        buffer: Buffer.from('content'),
        size: 1000
      } as Express.Multer.File;
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File must be a plain text file (.txt)');
    });

    it('should reject empty file', () => {
      const file = {
        mimetype: 'text/plain',
        buffer: Buffer.from(''),
        size: 0
      } as Express.Multer.File;
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File is empty');
    });

    it('should reject file exceeding size limit', () => {
      const file = {
        mimetype: 'text/plain',
        buffer: Buffer.from('content'),
        size: 6 * 1024 * 1024 // 6MB
      } as Express.Multer.File;
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File size exceeds 5MB limit');
    });
  });
});