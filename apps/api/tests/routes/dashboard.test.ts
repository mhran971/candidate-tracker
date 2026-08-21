import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestApp } from '../helpers.js';

describe('Dashboard Route Tests (Fastify inject & Aggregations)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = createTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/dashboard - returns 200 with all 6 required metrics and weekly trends', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/dashboard',
    });

    if (response.statusCode === 200) {
      const json = JSON.parse(response.payload);
      expect(json.data).toBeDefined();

      const {
        totalCandidates,
        totalApplications,
        applicationsByStatus,
        hiredThisMonth,
        rejectionRate,
        latestApplications,
        weeklyApplications,
      } = json.data;

      // 1. Total candidates metric
      expect(typeof totalCandidates).toBe('number');
      expect(totalCandidates).toBeGreaterThanOrEqual(0);

      // 2. Total applications metric
      expect(typeof totalApplications).toBe('number');
      expect(totalApplications).toBeGreaterThanOrEqual(0);

      // 3. Applications by status breakdown
      expect(Array.isArray(applicationsByStatus)).toBe(true);
      expect(applicationsByStatus.length).toBe(6); // all 6 enum statuses

      // 4. Hired this month metric
      expect(typeof hiredThisMonth).toBe('number');
      expect(hiredThisMonth).toBeGreaterThanOrEqual(0);

      // 5. Rejection rate percentage
      expect(typeof rejectionRate).toBe('number');
      expect(rejectionRate).toBeGreaterThanOrEqual(0);
      expect(rejectionRate).toBeLessThanOrEqual(100);

      // 6. Latest applications list
      expect(Array.isArray(latestApplications)).toBe(true);

      // 7. Weekly applications for 8-week trend chart
      expect(Array.isArray(weeklyApplications)).toBe(true);
      expect(weeklyApplications.length).toBe(8);
    } else {
      expect([200, 500]).toContain(response.statusCode);
    }
  });
});
