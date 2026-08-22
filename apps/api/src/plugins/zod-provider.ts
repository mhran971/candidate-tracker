import { FastifyInstance } from 'fastify';
import {
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

export function setupZodProvider(fastify: FastifyInstance): FastifyInstance {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(() => (data) => JSON.stringify(data));

  return fastify.withTypeProvider<ZodTypeProvider>();
}
