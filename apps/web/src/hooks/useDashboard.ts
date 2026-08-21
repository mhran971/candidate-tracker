import { useQuery } from '@tanstack/react-query';
import { fetchDashboardMetrics } from '@/api/dashboard';

export const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  metrics: () => [...DASHBOARD_KEYS.all, 'metrics'] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.metrics(),
    queryFn: fetchDashboardMetrics,
    refetchInterval: 1000 * 60, // Poll every minute for fresh live pipeline metrics
  });
}
