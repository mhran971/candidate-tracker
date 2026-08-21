import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  createApplicationSchema,
  applicationSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';

export const createApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: {
        tags: ['Applications'],
        summary: 'Create a new application',
        description: 'Creates a new application linked to an existing non-deleted candidate',
        body: createApplicationSchema,
        response: {
          201: z.object({
            data: applicationSchema,
          }),
          400: apiErrorResponseSchema,
          404: apiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body;

      // Verify that candidate exists and is not soft-deleted
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
          message: `Candidate with ID ${body.candidateId} was not found`,
        });
      }

      const application = await fastify.prisma.application.create({
        data: {
          candidateId: body.candidateId,
          jobTitle: body.jobTitle,
          company: body.company,
          status: body.status || 'applied',
          appliedAt: body.appliedAt,
          salaryExpectation: body.salaryExpectation ?? null,
          source: body.source || null,
          notes: body.notes || null,
        },
      });

      return reply.status(201).send({ data: application as any });
    }
  );
};
