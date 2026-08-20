import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  candidateQuerySchema,
  candidateSchema,
  paginationMetaSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const candidateListItemSchema = candidateSchema.extend({
  _count: z
    .object({
      applications: z.number().int().nonnegative(),
    })
    .optional(),
});

export const listCandidatesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Candidates'],
        summary: 'List candidates with pagination and search',
        querystring: candidateQuerySchema,
        response: {
          200: z.object({
            data: z.array(candidateListItemSchema),
            meta: paginationMetaSchema,
          }),
          400: apiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { page, limit, search, sortBy, sortOrder, location } = request.query;
      const skip = (page - 1) * limit;

      // Base condition: exclude soft-deleted records
      const where: Prisma.CandidateWhereInput = {
        deletedAt: null,
      };

      // Search filter across candidate fields
      if (search && search.trim() !== '') {
        const searchTerm = search.trim();
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }

      // Location specific filter
      if (location && location.trim() !== '') {
        where.location = { contains: location.trim(), mode: 'insensitive' };
      }

      // Dynamic sorting
      const orderBy: Prisma.CandidateOrderByWithRelationInput = {};
      if (sortBy && ['name', 'email', 'location', 'createdAt'].includes(sortBy)) {
        orderBy[sortBy as 'name' | 'email' | 'location' | 'createdAt'] = sortOrder;
      } else {
        orderBy.createdAt = 'desc';
      }

      const [total, candidates] = await Promise.all([
        fastify.prisma.candidate.count({ where }),
        fastify.prisma.candidate.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            _count: {
              select: { applications: true },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return reply.send({
        data: candidates,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      });
    }
  );
};
