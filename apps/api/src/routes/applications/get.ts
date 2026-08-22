import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  applicationParamsSchema,
} from '@candidate-tracker/shared';

export const getApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/:id',
    {
      schema: {
        params: applicationParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const application = await fastify.prisma.application.findFirst({
        where: {
          id,
          candidate: {
            deletedAt: null,
          },
        },
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              location: true,
            },
          },
        },
      });

      if (!application) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Application not found',
        });
      }

      return reply.send({ data: application });
    }
  );
};
