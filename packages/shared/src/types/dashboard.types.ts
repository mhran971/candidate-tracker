import { z } from 'zod';
import {
  statusCountSchema,
  weeklyApplicationStatSchema,
  dashboardMetricsSchema,
} from '../schemas/dashboard.schema.js';

export type StatusCount = z.infer<typeof statusCountSchema>;
export type WeeklyApplicationStat = z.infer<typeof weeklyApplicationStatSchema>;
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;
