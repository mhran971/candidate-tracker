import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  createCandidateSchema,
} from '@candidate-tracker/shared';

export const createCandidateRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: {
        body: createCandidateSchema,
      },
    },
    async (request, reply) => {
      const body = request.body;

      // Check for duplicate email proactively
      const existing = await fastify.prisma.candidate.findUnique({
        where: { email: body.email },
      });

      if (existing) {
        if (existing.deletedAt !== null) {
          // Reactivate soft-deleted candidate
          const reactivated = await fastify.prisma.candidate.update({
            where: { id: existing.id },
            data: {
              ...body,
              deletedAt: null,
            },
          });
          return reply.status(201).send({ data: reactivated });
        }

        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'A candidate with this email address already exists',
        });
      }

      const candidate = await fastify.prisma.candidate.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone ?? null,
          location: body.location ?? null,
          linkedinUrl: body.linkedinUrl ? body.linkedinUrl : null,
          notes: body.notes ?? null,
        },
      });

      return reply.status(201).send({ data: candidate });
    }
  );
};
