import request from 'supertest';
import createApp from '../../src/app';

describe('Vehicle Routes', () => {
  const app = createApp();

  describe('GET /vehicles', () => {
    it('should return all vehicle data', async () => {
      const response = await request(app).get('/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('makes');
      expect(response.body).toHaveProperty('vehicleData');
      expect(response.body).toHaveProperty('quickSelectVehicles');
      expect(response.body.makes).toContain('Tesla');
      expect(response.body.makes).toContain('Ford');
      expect(response.body.makes).toContain('BMW');
    });
  });

  describe('GET /vehicles/:make/models', () => {
    it('should return models for Ford', async () => {
      const response = await request(app).get('/vehicles/Ford/models');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        make: 'Ford',
        models: expect.arrayContaining(['Ranger', 'Falcon', 'Falcon Ute'])
      });
    });

    it('should return 404 for invalid make', async () => {
      const response = await request(app).get('/vehicles/InvalidMake/models');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /vehicles/:make/:model/badges', () => {
    it('should return badges for Tesla Model 3', async () => {
      const response = await request(app).get('/vehicles/Tesla/Model%203/badges');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        make: 'Tesla',
        model: 'Model 3',
        badges: expect.arrayContaining(['Dual Motor', 'Performance', 'Long Range'])
      });
    });

    it('should return 404 for invalid model', async () => {
      const response = await request(app).get('/vehicles/Tesla/InvalidModel/badges');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});