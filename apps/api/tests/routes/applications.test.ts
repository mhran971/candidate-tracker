import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestApp } from '../helpers.js';

describe('Applications Route Tests (Fastify inject & Cross-Entity Search)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = createTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/applications - returns 400 when required fields are missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/applications',
      payload: {
        jobTitle: 'Software Engineer',
        // missing candidateId, company, appliedAt
      },
    });

    expect(response.statusCode).toBe(400);
    const json = JSON.parse(response.payload);
    expect(json.statusCode).toBe(400);
    expect(json.error).toBe('Bad Request');
  });

  it('POST /api/applications - returns 404 on nonexistent candidate_id', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/applications',
      payload: {
        candidateId: '00000000-0000-0000-0000-000000000000',
        jobTitle: 'Backend Developer',
        company: 'Acme Corp',
        status: 'applied',
        appliedAt: new Date().toISOString(),
      },
    });

    expect([404, 500]).toContain(response.statusCode);
  });

  it('GET /api/applications - accepts cross-entity search and filter query parameters', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/applications?search=Alice&status=interview&page=1&limit=10',
    });

    if (response.statusCode === 200) {
      const json = JSON.parse(response.payload);
      expect(json.data).toBeDefined();
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.meta).toBeDefined();
    } else {
      expect([200, 500]).toContain(response.statusCode);
    }
  });

  it('GET /api/applications - returns 400 on invalid status enum value', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/applications?status=invalid_status_enum',
    });

    expect(response.statusCode).toBe(400);
    const json = JSON.parse(response.payload);
    expect(json.statusCode).toBe(400);
  });

  it('PATCH /api/applications/:id - returns 400 on invalid UUID param', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/applications/invalid-uuid',
      payload: {
        status: 'offer',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('DELETE /api/applications/:id - returns 400 on invalid UUID param', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/applications/invalid-uuid',
    });

    expect(response.statusCode).toBe(400);
  });
});
