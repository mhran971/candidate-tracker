import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createApplicationRoute } from './create.js';
import { listApplicationsRoute } from './list.js';
import { getApplicationRoute } from './get.js';
import { updateApplicationRoute } from './update.js';
import { deleteApplicationRoute } from './delete.js';

export const applicationsRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(createApplicationRoute);
  fastify.register(listApplicationsRoute);
  fastify.register(getApplicationRoute);
  fastify.register(updateApplicationRoute);
  fastify.register(deleteApplicationRoute);
};
