const request = require('supertest');
const { app, server } = require('../src/index');

describe('Express App', () => {
  afterAll(() => {
    server.close();
  });

  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Hello World!');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });

  test('GET /health should return healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });

  test('POST /api/data should return personalized message', async () => {
    const response = await request(app)
      .post('/api/data')
      .send({ name: 'John' });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, John!' });
  });

  test('POST /api/data should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/api/data')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Name is required' });
  });
});