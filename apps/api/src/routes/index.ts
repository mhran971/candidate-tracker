import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { candidatesRoutes } from './candidates/index.js';

export const apiRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(candidatesRoutes, { prefix: '/candidates' });
};
