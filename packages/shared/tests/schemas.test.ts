import { describe, it, expect } from 'vitest';
import {
  createCandidateSchema,
  createApplicationSchema,
  paginationQuerySchema,
  APPLICATION_STATUSES,
} from '../src/index.js';

describe('Shared Zod Schemas Unit Tests', () => {
  describe('Candidate Schemas', () => {
    it('passes for valid candidate creation input', () => {
      const valid = {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        phone: '+1 555-9999',
        location: 'Los Angeles, CA',
        linkedinUrl: 'https://linkedin.com/in/sarahconnor',
        notes: 'Great technical background',
      };

      const result = createCandidateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('fails when candidate name is missing or empty', () => {
      const invalid = {
        email: 'sarah@example.com',
      };

      const result = createCandidateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.some((e) => e.path.includes('name'))).toBe(true);
      }
    });

    it('fails when candidate email is invalid', () => {
      const invalid = {
        name: 'Sarah Connor',
        email: 'not-an-email',
      };

      const result = createCandidateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.some((e) => e.path.includes('email'))).toBe(true);
      }
    });
  });

  describe('Application Schemas', () => {
    it('passes for valid application creation input', () => {
      const valid = {
        candidateId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        jobTitle: 'Frontend Engineer',
        company: 'Stripe',
        status: 'applied',
        appliedAt: new Date().toISOString(),
        salaryExpectation: 150000,
        source: 'LinkedIn',
      };

      const result = createApplicationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('fails when application status is invalid enum', () => {
      const invalid = {
        candidateId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        jobTitle: 'Frontend Engineer',
        company: 'Stripe',
        status: 'unknown_status',
        appliedAt: new Date().toISOString(),
      };

      const result = createApplicationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('allows all 6 official application statuses', () => {
      for (const status of APPLICATION_STATUSES) {
        const payload = {
          candidateId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          jobTitle: 'Frontend Engineer',
          company: 'Stripe',
          status,
          appliedAt: new Date().toISOString(),
        };
        const result = createApplicationSchema.safeParse(payload);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Pagination & Common Schemas', () => {
    it('applies default pagination values (page 1, limit 10, sortOrder desc)', () => {
      const parsed = paginationQuerySchema.parse({});
      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(10);
      expect(parsed.sortOrder).toBe('desc');
    });

    it('coerces string numbers for page and limit', () => {
      const parsed = paginationQuerySchema.parse({
        page: '3',
        limit: '25',
      });
      expect(parsed.page).toBe(3);
      expect(parsed.limit).toBe(25);
    });
  });
});
