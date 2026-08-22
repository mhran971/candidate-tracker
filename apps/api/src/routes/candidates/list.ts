import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  candidateQuerySchema,
} from '@candidate-tracker/shared';
import { Prisma } from '@prisma/client';

export const listCandidatesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        querystring: candidateQuerySchema,
      },
    },
    async (request, reply) => {
      const { page, limit, search, location, sortBy, sortOrder } = request.query;

      const skip = (page - 1) * limit;

      // Base query: exclude soft-deleted records
      const where: Prisma.CandidateWhereInput = {
        deletedAt: null,
      };

      // Search filter across name and email
      if (search && search.trim() !== '') {
        const query = search.trim();
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ];
      }

      // Location filter
      if (location && location.trim() !== '') {
        where.location = { contains: location.trim(), mode: 'insensitive' };
      }

      // Dynamic sorting
      const orderBy: Prisma.CandidateOrderByWithRelationInput = {
        [sortBy as string]: sortOrder,
      };

      // Parallel execution for total count and paginated items
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
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    }
  );
};
