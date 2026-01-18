import request from 'supertest';
import createApp from '../../src/app';

describe('Upload Routes', () => {
  const app = createApp();

  describe('POST /upload', () => {
    it('should upload vehicle and logbook successfully', async () => {
      const response = await request(app)
        .post('/upload')
        .field('make', 'Tesla')
        .field('model', 'Model 3')
        .field('badge', 'Performance')
        .attach('logbook', Buffer.from('Service log content'), 'logbook.txt');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicle');
      expect(response.body.vehicle).toEqual({
        make: 'Tesla',
        model: 'Model 3',
        badge: 'Performance'
      });
      expect(response.body).toHaveProperty('logbookContents', 'Service log content');
    });

    it('should reject missing vehicle data', async () => {
      const response = await request(app)
        .post('/upload')
        .field('make', 'Tesla')
        .attach('logbook', Buffer.from('content'), 'logbook.txt');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing file', async () => {
      const response = await request(app)
        .post('/upload')
        .field('make', 'Tesla')
        .field('model', 'Model 3')
        .field('badge', 'Performance');

      expect(response.status).toBe(400);
    });

    it('should reject non-text file', async () => {
      const response = await request(app)
        .post('/upload')
        .field('make', 'Tesla')
        .field('model', 'Model 3')
        .field('badge', 'Performance')
        .attach('logbook', Buffer.from('fake pdf'), { filename: 'test.pdf', contentType: 'application/pdf' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message', 'Server is running');
    });
  });
});