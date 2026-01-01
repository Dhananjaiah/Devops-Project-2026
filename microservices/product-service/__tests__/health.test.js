const request = require('supertest');

const app = require('../index');

describe('product-service', () => {
  it('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('service', 'product-service');
  });
});
