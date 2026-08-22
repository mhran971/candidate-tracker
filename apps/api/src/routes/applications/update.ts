import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  applicationParamsSchema,
  updateApplicationSchema,
} from '@candidate-tracker/shared';

export const updateApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.patch(
    '/:id',
    {
      schema: {
        params: applicationParamsSchema,
        body: updateApplicationSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const body = request.body;

      // Verify application exists
      const existing = await fastify.prisma.application.findUnique({
        where: { id },
        include: { candidate: true },
      });

      if (!existing || existing.candidate.deletedAt !== null) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Application not found',
        });
      }

      // If candidateId is being updated, verify new candidate exists
      if (body.candidateId && body.candidateId !== existing.candidateId) {
        const targetCandidate = await fastify.prisma.candidate.findFirst({
          where: {
            id: body.candidateId,
            deletedAt: null,
          },
        });

        if (!targetCandidate) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Target candidate with ID ${body.candidateId} not found`,
          });
        }
      }

      const updated = await fastify.prisma.application.update({
        where: { id },
        data: {
          ...(body.candidateId !== undefined && { candidateId: body.candidateId }),
          ...(body.jobTitle !== undefined && { jobTitle: body.jobTitle }),
          ...(body.company !== undefined && { company: body.company }),
          ...(body.status !== undefined && { status: body.status }),
          ...(body.appliedAt !== undefined && {
            appliedAt: new Date(body.appliedAt),
          }),
          ...(body.salaryExpectation !== undefined && {
            salaryExpectation: body.salaryExpectation,
          }),
          ...(body.source !== undefined && { source: body.source }),
          ...(body.notes !== undefined && { notes: body.notes }),
        },
      });

      return reply.send({ data: updated });
    }
  );
};
