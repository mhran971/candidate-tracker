import { z } from 'zod';
import { applicationStatusSchema, applicationWithCandidateSchema } from './application.schema.js';

export const statusCountSchema = z.object({
  status: applicationStatusSchema,
  count: z.number().int().nonnegative(),
});

export const weeklyApplicationStatSchema = z.object({
  week: z.string(), // ISO week or date string
  label: z.string(), // Display label e.g. "Week 12" or "Aug 10 - Aug 16"
  count: z.number().int().nonnegative(),
});

export const dashboardMetricsSchema = z.object({
  totalCandidates: z.number().int().nonnegative(),
  totalApplications: z.number().int().nonnegative(),
  applicationsByStatus: z.array(statusCountSchema),
  hiredThisMonth: z.number().int().nonnegative(),
  rejectionRate: z.number().nonnegative().max(100),
  latestApplications: z.array(applicationWithCandidateSchema),
  weeklyApplications: z.array(weeklyApplicationStatSchema),
});
