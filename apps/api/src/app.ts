import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { corsConfig } from './config/cors.js';
import { setupErrorHandler } from './plugins/error-handler.js';
import { setupZodProvider } from './plugins/zod-provider.js';
import prismaPlugin from './plugins/prisma.js';
import { apiRoutes } from './routes/index.js';

export function buildApp(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = fastify({
    logger: {
      level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    },
    ...opts,
  }).withTypeProvider<ZodTypeProvider>();

  // Setup Zod validation compiler
  setupZodProvider(app);

  // Setup global error handling
  setupErrorHandler(app);

  // Register plugins
  app.register(cors, corsConfig);
  app.register(prismaPlugin);

  // Register API routes
  app.register(apiRoutes, { prefix: '/api' });

  // Health check route
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return app;
}
