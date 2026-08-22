import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  candidateParamsSchema,
} from '@candidate-tracker/shared';

export const getCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/:id',
    {
      schema: {
        params: candidateParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const candidate = await fastify.prisma.candidate.findFirst({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          applications: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!candidate) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Candidate not found',
        });
      }

      return reply.send({ data: candidate });
    }
  );
};
