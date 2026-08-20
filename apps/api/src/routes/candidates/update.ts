import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  candidateParamsSchema,
  updateCandidateSchema,
  candidateSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';

export const updateCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.patch(
    '/:id',
    {
      schema: {
        tags: ['Candidates'],
        summary: 'Update an existing candidate',
        params: candidateParamsSchema,
        body: updateCandidateSchema,
        response: {
          200: z.object({
            data: candidateSchema,
          }),
          400: apiErrorResponseSchema,
          404: apiErrorResponseSchema,
          409: apiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const body = request.body;

      // Verify candidate exists and is not soft-deleted
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

      // If email is being changed, verify uniqueness
      if (body.email && body.email !== existing.email) {
        const emailExists = await fastify.prisma.candidate.findUnique({
          where: { email: body.email },
        });

        if (emailExists && emailExists.id !== id) {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            message: `A candidate with email "${body.email}" already exists`,
          });
        }
      }

      const updated = await fastify.prisma.candidate.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.email !== undefined && { email: body.email }),
          ...(body.phone !== undefined && { phone: body.phone }),
          ...(body.location !== undefined && { location: body.location }),
          ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
          ...(body.notes !== undefined && { notes: body.notes }),
        },
      });

      return reply.send({ data: updated });
    }
  );
};
