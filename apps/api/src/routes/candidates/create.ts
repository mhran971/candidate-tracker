import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  createCandidateSchema,
  candidateSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';

export const createCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: {
        tags: ['Candidates'],
        summary: 'Create a new candidate',
        description: 'Creates a new candidate after verifying email uniqueness',
        body: createCandidateSchema,
        response: {
          201: z.object({
            data: candidateSchema,
          }),
          400: apiErrorResponseSchema,
          409: apiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body;

      // Check for duplicate email proactively
      const existingCandidate = await fastify.prisma.candidate.findUnique({
        where: { email: body.email },
      });

      if (existingCandidate) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: `A candidate with email "${body.email}" already exists`,
        });
      }

      const candidate = await fastify.prisma.candidate.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone || null,
          location: body.location || null,
          linkedinUrl: body.linkedinUrl || null,
          notes: body.notes || null,
        },
      });

      return reply.status(201).send({ data: candidate });
    }
  );
};
