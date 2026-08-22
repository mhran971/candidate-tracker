import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  applicationQuerySchema,
} from '@candidate-tracker/shared';
import { Prisma } from '@prisma/client';

export const listApplicationsRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        querystring: applicationQuerySchema,
      },
    },
    async (request, reply) => {
      const {
        page,
        limit,
        search,
        candidateId,
        status,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      } = request.query;

      const skip = (page - 1) * limit;

      // Base condition: candidate must not be soft-deleted
      const where: Prisma.ApplicationWhereInput = {
        candidate: {
          deletedAt: null,
        },
      };

      // Filter by candidate ID
      if (candidateId) {
        where.candidateId = candidateId;
      }

      // Filter by application status
      if (status) {
        where.status = status;
      }

      // Date range filter on appliedAt
      if (dateFrom || dateTo) {
        where.appliedAt = {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        };
      }

      // Cross-entity search: Search in Application fields AND linked Candidate fields
      if (search && search.trim() !== '') {
        const query = search.trim();
        where.OR = [
          { jobTitle: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } },
          { source: { contains: query, mode: 'insensitive' } },
          { notes: { contains: query, mode: 'insensitive' } },
          {
            candidate: {
              name: { contains: query, mode: 'insensitive' },
              deletedAt: null,
            },
          },
          {
            candidate: {
              email: { contains: query, mode: 'insensitive' },
              deletedAt: null,
            },
          },
          {
            candidate: {
              location: { contains: query, mode: 'insensitive' },
              deletedAt: null,
            },
          },
        ];
      }

      // Dynamic sorting
      const sortField = sortBy || 'createdAt';
      const orderBy: Prisma.ApplicationOrderByWithRelationInput = {
        [sortField]: sortOrder || 'desc',
      };

      // Execute count and data fetch in parallel
      const [total, applications] = await Promise.all([
        fastify.prisma.application.count({ where }),
        fastify.prisma.application.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                location: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return reply.send({
        data: applications,
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
