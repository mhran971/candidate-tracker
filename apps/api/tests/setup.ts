import { beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

export const testPrisma = new PrismaClient();

beforeAll(async () => {
  // Verify test database connection
  try {
    await testPrisma.$connect();
  } catch (error) {
    console.warn('⚠️ Test DB not directly connected. Fastify inject tests will use mocked or test instance.');
  }
});

afterAll(async () => {
  try {
    await testPrisma.$disconnect();
  } catch {
    // Ignore disconnect error
  }
});
