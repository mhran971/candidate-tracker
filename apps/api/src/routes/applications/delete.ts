import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  applicationParamsSchema,
} from '@candidate-tracker/shared';

export const deleteApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    '/:id',
    {
      schema: {
        params: applicationParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const existing = await fastify.prisma.application.findUnique({
        where: { id },
      });

      if (!existing) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Application not found',
        });
      }

      await fastify.prisma.application.delete({
        where: { id },
      });

      return reply.send({
        message: 'Application deleted successfully',
        id,
      });
    }
  );
};
