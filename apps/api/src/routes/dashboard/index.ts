import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  dashboardMetricsSchema,
  apiErrorResponseSchema,
  APPLICATION_STATUSES,
  ApplicationStatus,
} from '@candidate-tracker/shared';
import { z } from 'zod';

export const dashboardRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Dashboard'],
        summary: 'Get aggregated dashboard metrics and chart analytics',
        description:
          'Computes total candidates, applications by status, monthly hires, rejection rate, latest activity, and weekly trends via database aggregations.',
        response: {
          200: z.object({
            data: dashboardMetricsSchema,
          }),
          500: apiErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calculate 8 weeks ago date for weekly trend chart
      const eightWeeksAgo = new Date();
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

      // Base candidate condition: exclude soft-deleted
      const candidateWhere = { deletedAt: null };
      const appWhere = { candidate: { deletedAt: null } };

      const [
        totalCandidates,
        totalApplications,
        statusCountsRaw,
        hiredThisMonth,
        rejectedCount,
        latestApplications,
        recentApplicationsForTrend,
      ] = await Promise.all([
        // 1. Total Candidates count
        fastify.prisma.candidate.count({
          where: candidateWhere,
        }),

        // 2. Total Applications count
        fastify.prisma.application.count({
          where: appWhere,
        }),

        // 3. Applications grouped by status (GROUP BY)
        fastify.prisma.application.groupBy({
          by: ['status'],
          where: appWhere,
          _count: {
            _all: true,
          },
        }),

        // 4. Hired this month count
        fastify.prisma.application.count({
          where: {
            ...appWhere,
            status: 'hired',
            appliedAt: {
              gte: startOfCurrentMonth,
            },
          },
        }),

        // 5. Total rejected count (for rejection rate calculation)
        fastify.prisma.application.count({
          where: {
            ...appWhere,
            status: 'rejected',
          },
        }),

        // 6. Latest 10 applications with candidate details
        fastify.prisma.application.findMany({
          where: appWhere,
          take: 10,
          orderBy: { createdAt: 'desc' },
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

        // 7. Applications from last 8 weeks for trend calculation
        fastify.prisma.application.findMany({
          where: {
            ...appWhere,
            appliedAt: {
              gte: eightWeeksAgo,
            },
          },
          select: {
            appliedAt: true,
          },
          orderBy: {
            appliedAt: 'asc',
          },
        }),
      ]);

      // Ensure all 6 statuses are present in the response even if count is 0
      const statusCountMap = new Map<ApplicationStatus, number>();
      for (const status of APPLICATION_STATUSES) {
        statusCountMap.set(status, 0);
      }
      for (const item of statusCountsRaw) {
        statusCountMap.set(item.status as ApplicationStatus, item._count._all);
      }

      const applicationsByStatus = Array.from(statusCountMap.entries()).map(([status, count]) => ({
        status,
        count,
      }));

      // Calculate rejection rate percentage (rounded to 1 decimal place)
      const rejectionRate =
        totalApplications > 0 ? Number(((rejectedCount / totalApplications) * 100).toFixed(1)) : 0;

      // Group last 8 weeks into weekly buckets
      const weeklyStatsMap = new Map<string, { label: string; count: number }>();
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - i * 7);
        const weekKey = `W-${weekStart.getFullYear()}-${Math.ceil(weekStart.getDate() / 7)}`;
        const monthName = weekStart.toLocaleString('default', { month: 'short' });
        const label = `${monthName} ${weekStart.getDate()}`;
        weeklyStatsMap.set(weekKey, { label, count: 0 });
      }

      for (const app of recentApplicationsForTrend) {
        const appDate = new Date(app.appliedAt);
        const appKey = `W-${appDate.getFullYear()}-${Math.ceil(appDate.getDate() / 7)}`;
        const entry = weeklyStatsMap.get(appKey);
        if (entry) {
          entry.count += 1;
        }
      }

      const weeklyApplications = Array.from(weeklyStatsMap.entries()).map(([week, val]) => ({
        week,
        label: val.label,
        count: val.count,
      }));

      return reply.send({
        data: {
          totalCandidates,
          totalApplications,
          applicationsByStatus,
          hiredThisMonth,
          rejectionRate,
          latestApplications: latestApplications as any,
          weeklyApplications,
        },
      });
    }
  );
};
