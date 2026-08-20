import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { candidateParamsSchema, apiErrorResponseSchema } from '@candidate-tracker/shared';
import { z } from 'zod';

export const deleteCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Candidates'],
        summary: 'Soft delete a candidate',
        description: 'Sets deleted_at timestamp. The candidate will no longer appear in lists or search.',
        params: candidateParamsSchema,
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

      const existing = await fastify.prisma.candidate.findFirst({
        where: { id, deletedAt: null },
      });

      if (!existing) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Candidate with ID ${id} not found`,
        });
      }

      await fastify.prisma.candidate.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return reply.send({
        message: 'Candidate successfully soft-deleted',
        id,
      });
    }
  );
};
