import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  createApplicationSchema,
} from '@candidate-tracker/shared';

export const createApplicationRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: {
        body: createApplicationSchema,
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
          message: `Candidate with ID ${body.candidateId} not found`,
        });
      }

      const application = await fastify.prisma.application.create({
        data: {
          candidateId: body.candidateId,
          jobTitle: body.jobTitle,
          company: body.company,
          status: body.status ?? 'applied',
          appliedAt: body.appliedAt ? new Date(body.appliedAt) : new Date(),
          salaryExpectation: body.salaryExpectation ?? null,
          source: body.source ?? null,
          notes: body.notes ?? null,
        },
      });

      return reply.status(201).send({ data: application });
    }
  );
};
