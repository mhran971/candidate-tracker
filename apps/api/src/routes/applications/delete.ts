import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { applicationParamsSchema, apiErrorResponseSchema } from '@candidate-tracker/shared';
import { z } from 'zod';

export const deleteApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Applications'],
        summary: 'Delete an application',
        params: applicationParamsSchema,
        response: {
          200: z.object({
            message: z.string(),
            id: z.string().uuid(),
          }),
          404: apiErrorResponseSchema,
        },
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
          message: `Application with ID ${id} was not found`,
        });
      }

      await fastify.prisma.application.delete({
        where: { id },
      });

      return reply.send({
        message: 'Application successfully deleted',
        id,
      });
    }
  );
};
