const { handleUpload, healthCheck } = require('../../src/controllers/uploadController');

describe('Upload Controller', () => {
  describe('handleUpload', () => {
    it('should successfully process valid upload', async () => {
      const req = {
        body: { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
        file: {
          buffer: Buffer.from('Service log content'),
          originalname: 'logbook.txt',
          mimetype: 'text/plain',
          size: 1000
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await handleUpload(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicle: { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
          logbookContents: 'Service log content',
          filename: 'logbook.txt'
        })
      );
    });

    it('should return 400 for invalid vehicle data', async () => {
      const req = {
        body: { make: '', model: 'Model 3', badge: 'Performance' },
        file: {
          buffer: Buffer.from('content'),
          originalname: 'logbook.txt',
          mimetype: 'text/plain',
          size: 1000
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await handleUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed'
        })
      );
    });

    it('should return 400 for missing file', async () => {
      const req = {
        body: { make: 'Tesla', model: 'Model 3', badge: 'Performance' },
        file: null
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await handleUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'File validation failed'
        })
      );
    });

    it('should trim whitespace from vehicle data', async () => {
      const req = {
        body: { make: '  Tesla  ', model: '  Model 3  ', badge: '  Performance  ' },
        file: {
          buffer: Buffer.from('content'),
          originalname: 'logbook.txt',
          mimetype: 'text/plain',
          size: 1000
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await handleUpload(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicle: { make: 'Tesla', model: 'Model 3', badge: 'Performance' }
        })
      );
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const req = {};
      const res = {
        json: jest.fn()
      };

      healthCheck(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'OK',
          message: 'Server is running'
        })
      );
    });
  });
});