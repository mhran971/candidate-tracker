import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  applicationParamsSchema,
  updateApplicationSchema,
  applicationSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';

export const updateApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.patch(
    '/:id',
    {
      schema: {
        tags: ['Applications'],
        summary: 'Update an existing application',
        description: 'Updates application fields, with optional candidate reassignment validation',
        params: applicationParamsSchema,
        body: updateApplicationSchema,
        response: {
          200: z.object({
            data: applicationSchema,
          }),
          400: apiErrorResponseSchema,
          404: apiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const body = request.body;

      // Check application exists
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

      // If candidateId is being reassigned, check that the new candidate exists
      if (body.candidateId && body.candidateId !== existing.candidateId) {
        const candidate = await fastify.prisma.candidate.findFirst({
          where: {
            id: body.candidateId,
            deletedAt: null,
          },
        });

        if (!candidate) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Target candidate with ID ${body.candidateId} was not found`,
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
          ...(body.appliedAt !== undefined && { appliedAt: body.appliedAt }),
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
