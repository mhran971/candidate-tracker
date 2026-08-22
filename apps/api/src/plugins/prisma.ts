import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

// Global cached Prisma instance to reuse connection pools across serverless function invocations
let globalPrisma: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (!globalPrisma) {
    globalPrisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }
  return globalPrisma;
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const prisma = getPrismaClient();
  fastify.decorate('prisma', prisma);
});

export default prismaPlugin;
