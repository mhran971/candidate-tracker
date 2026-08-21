import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  candidateParamsSchema,
  candidateSchema,
  applicationSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';

const candidateDetailResponseSchema = candidateSchema.extend({
  applications: z.array(applicationSchema),
});

export const getCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Candidates'],
        summary: 'Get candidate by ID with associated applications',
        params: candidateParamsSchema,
        response: {
          200: z.object({
            data: candidateDetailResponseSchema,
          }),
          404: apiErrorResponseSchema,
        },
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
            orderBy: { appliedAt: 'desc' },
          },
        },
      });

      if (!candidate) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Candidate with ID ${id} not found`,
        });
      }

      return reply.send({ data: candidate as any });
    }
  );
};
