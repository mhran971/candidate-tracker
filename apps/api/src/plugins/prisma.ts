import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const DEFAULT_DATABASE_URL =
  'postgresql://postgres.cxqvptwxenshwuxlbenw:mH671939200%25@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

// Global cached Prisma instance to reuse connection pools across serverless function invocations
let globalPrisma: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (!globalPrisma) {
    let dbUrl = (process.env.DATABASE_URL || DEFAULT_DATABASE_URL).trim().replace(/^["']|["']$/g, '');
    process.env.DATABASE_URL = dbUrl;
    globalPrisma = new PrismaClient({
      datasources: { db: { url: dbUrl } },
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
