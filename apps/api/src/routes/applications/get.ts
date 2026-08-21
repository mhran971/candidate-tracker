import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  applicationParamsSchema,
  applicationWithCandidateSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';

export const getApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Applications'],
        summary: 'Get application by ID with linked candidate details',
        params: applicationParamsSchema,
        response: {
          200: z.object({
            data: applicationWithCandidateSchema,
          }),
          404: apiErrorResponseSchema,
        },
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
          message: `Application with ID ${id} was not found`,
        });
      }

      return reply.send({ data: application });
    }
  );
};
