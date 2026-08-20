import { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

export function setupZodProvider(fastify: FastifyInstance): FastifyInstance {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  return fastify.withTypeProvider<ZodTypeProvider>();
}
