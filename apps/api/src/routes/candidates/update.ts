import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  candidateParamsSchema,
  updateCandidateSchema,
} from '@candidate-tracker/shared';

export const updateCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.patch(
    '/:id',
    {
      schema: {
        params: candidateParamsSchema,
        body: updateCandidateSchema,
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
          message: 'Candidate not found',
        });
      }

      // If email is being updated, verify uniqueness
      if (body.email && body.email !== existing.email) {
        const emailConflict = await fastify.prisma.candidate.findFirst({
          where: {
            email: body.email,
            id: { not: id },
            deletedAt: null,
          },
        });

        if (emailConflict) {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            message: 'A candidate with this email address already exists',
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
          ...(body.linkedinUrl !== undefined && {
            linkedinUrl: body.linkedinUrl ? body.linkedinUrl : null,
          }),
          ...(body.notes !== undefined && { notes: body.notes }),
        },
      });

      return reply.send({ data: updated });
    }
  );
};
