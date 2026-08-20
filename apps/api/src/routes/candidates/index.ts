import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createCandidateRoute } from './create.js';
import { listCandidatesRoute } from './list.js';
import { getCandidateRoute } from './get.js';
import { updateCandidateRoute } from './update.js';
import { deleteCandidateRoute } from './delete.js';

export const candidatesRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(createCandidateRoute);
  fastify.register(listCandidatesRoute);
  fastify.register(getCandidateRoute);
  fastify.register(updateCandidateRoute);
  fastify.register(deleteCandidateRoute);
};
