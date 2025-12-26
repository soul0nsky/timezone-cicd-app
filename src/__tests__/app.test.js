const request = require('supertest');
const app = require('../app');

describe('Timezone App Tests', () => {
  test('GET / should return 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  }, 10000);

  test('GET / should contain HTML with timezone title', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('Часовые пояса России');
    expect(response.text).toContain('Калининград');
    expect(response.text).toContain('Москва');
    expect(response.text).toContain('Новосибирск');
    expect(response.text).toContain('Владивосток');
  });

  test('GET /api/time should return JSON with timezone data', async () => {
    const response = await request(app).get('/api/time');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('GET /health should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('port');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('GET /api/time should have correct timezone data structure', async () => {
    const response = await request(app).get('/api/time');
    const { data } = response.body;

    expect(data).toHaveProperty('Калининград');
    expect(data).toHaveProperty('Москва');
    expect(data).toHaveProperty('Новосибирск');
    expect(data).toHaveProperty('Владивосток');

    Object.values(data).forEach(cityData => {
      expect(cityData).toHaveProperty('time');
      expect(cityData).toHaveProperty('timezone');
      expect(cityData).toHaveProperty('offset');
      expect(typeof cityData.time).toBe('string');
      expect(typeof cityData.timezone).toBe('string');
    });
  });
});
