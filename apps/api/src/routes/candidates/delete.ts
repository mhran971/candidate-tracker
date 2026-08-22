import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  candidateParamsSchema,
} from '@candidate-tracker/shared';

export const deleteCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    '/:id',
    {
      schema: {
        params: candidateParamsSchema,
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
          message: 'Candidate not found',
        });
      }

      // Perform soft delete by setting deletedAt to current timestamp
      await fastify.prisma.candidate.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return reply.send({
        message: 'Candidate deleted successfully',
        id,
      });
    }
  );
};
