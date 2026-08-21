import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { candidatesRoutes } from './candidates/index.js';
import { applicationsRoutes } from './applications/index.js';

export const apiRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(candidatesRoutes, { prefix: '/candidates' });
  fastify.register(applicationsRoutes, { prefix: '/applications' });
};
