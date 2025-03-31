import axios from 'axios';

const API_URL = process.env.API_URL || 'https://medicine-reminder-backend.onrender.com';

describe('API Endpoints', () => {
  let authToken: string;
  let userId: string;
  let medicationId: string;

  // Test registration
  test('POST /auth/register', async () => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('access_token');
    expect(response.data).toHaveProperty('user');
    authToken = response.data.access_token;
    userId = response.data.user.id;
  });

  // Test login
  test('POST /auth/login', async () => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('access_token');
    authToken = response.data.access_token;
  });

  // Test creating a medication
  test('POST /medications', async () => {
    const response = await axios.post(
      `${API_URL}/medications`,
      {
        name: 'Test Medication',
        dose: '1 tablet',
        times: ['09:00', '21:00'],
        duration: 7,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    medicationId = response.data.id;
  });

  // Test getting all medications
  test('GET /medications', async () => {
    const response = await axios.get(`${API_URL}/medications`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  // Test getting a single medication
  test('GET /medications/:id', async () => {
    const response = await axios.get(`${API_URL}/medications/${medicationId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', medicationId);
  });

  // Test updating a medication
  test('PATCH /medications/:id', async () => {
    const response = await axios.patch(
      `${API_URL}/medications/${medicationId}`,
      {
        name: 'Updated Medication',
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.name).toBe('Updated Medication');
  });

  // Test toggling medication taken status
  test('PATCH /medications/:id/toggle', async () => {
    const response = await axios.patch(
      `${API_URL}/medications/${medicationId}/toggle`,
      {
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('takenDates');
  });

  // Test deleting a medication
  test('DELETE /medications/:id', async () => {
    const response = await axios.delete(`${API_URL}/medications/${medicationId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(200);
  });

  // Test logout
  test('POST /auth/logout', async () => {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
  });
}); 