import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';

export function createTestApp(): FastifyInstance {
  const app = buildApp({
    logger: false,
  });
  return app;
}

export const TEST_CANDIDATE_PAYLOAD = {
  name: 'Test Candidate',
  email: `test.${Date.now()}@example.com`,
  phone: '+1 (555) 000-1111',
  location: 'San Francisco, CA',
  linkedinUrl: 'https://linkedin.com/in/testcandidate',
  notes: 'Automated test candidate notes',
};
