import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  applicationQuerySchema,
  applicationWithCandidateSchema,
  paginationMetaSchema,
  apiErrorResponseSchema,
} from '@candidate-tracker/shared';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const listApplicationsRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Applications'],
        summary: 'List applications with cross-entity search and filtering',
        description:
          'Searches across both Application fields (jobTitle, company, source, notes) and linked Candidate fields (name, email, location) via server-side SQL JOIN.',
        querystring: applicationQuerySchema,
        response: {
          200: z.object({
            data: z.array(applicationWithCandidateSchema),
            meta: paginationMetaSchema,
          }),
          400: apiErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { page, limit, search, status, candidateId, dateFrom, dateTo, sortBy, sortOrder } =
        request.query;

      const skip = (page - 1) * limit;

      // Base query: only include applications belonging to active (non-soft-deleted) candidates
      const where: Prisma.ApplicationWhereInput = {
        candidate: {
          deletedAt: null,
        },
      };

      // Filter by specific candidate
      if (candidateId) {
        where.candidateId = candidateId;
      }

      // Filter by status enum
      if (status) {
        where.status = status;
      }

      // Filter by applied_at date range
      if (dateFrom || dateTo) {
        where.appliedAt = {};
        if (dateFrom) {
          where.appliedAt.gte = dateFrom;
        }
        if (dateTo) {
          where.appliedAt.lte = dateTo;
        }
      }

      // Cross-entity search: searches across Application + joined Candidate in SQL
      if (search && search.trim() !== '') {
        const searchTerm = search.trim();
        where.OR = [
          // Application table fields
          { jobTitle: { contains: searchTerm } },
          { company: { contains: searchTerm } },
          { source: { contains: searchTerm } },
          { notes: { contains: searchTerm } },
          // Joined Candidate table fields (server-side JOIN in Prisma)
          {
            candidate: {
              name: { contains: searchTerm },
              deletedAt: null,
            },
          },
          {
            candidate: {
              email: { contains: searchTerm },
              deletedAt: null,
            },
          },
          {
            candidate: {
              location: { contains: searchTerm },
              deletedAt: null,
            },
          },
        ];
      }

      // Order by specification
      const orderBy: Prisma.ApplicationOrderByWithRelationInput = {};
      if (sortBy && ['jobTitle', 'company', 'status', 'appliedAt', 'createdAt'].includes(sortBy)) {
        orderBy[sortBy as 'jobTitle' | 'company' | 'status' | 'appliedAt' | 'createdAt'] = sortOrder;
      } else {
        orderBy.appliedAt = 'desc';
      }

      // Execute SQL COUNT and SELECT queries with JOIN
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
        data: applications as any,
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
