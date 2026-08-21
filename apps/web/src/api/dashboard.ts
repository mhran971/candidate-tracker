import { apiClient } from './client';
import { DashboardMetrics } from '@candidate-tracker/shared';

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await apiClient.get<{ data: DashboardMetrics }>('/dashboard');
  return response.data.data;
}
