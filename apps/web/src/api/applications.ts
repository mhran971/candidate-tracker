import { apiClient } from './client';
import {
  Application,
  ApplicationWithCandidate,
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationQuery,
  PaginatedResult,
} from '@candidate-tracker/shared';

export async function fetchApplications(
  params: ApplicationQuery
): Promise<PaginatedResult<ApplicationWithCandidate>> {
  const response = await apiClient.get<PaginatedResult<ApplicationWithCandidate>>('/applications', {
    params,
  });
  return response.data;
}

export async function fetchApplication(id: string): Promise<ApplicationWithCandidate> {
  const response = await apiClient.get<{ data: ApplicationWithCandidate }>(`/applications/${id}`);
  return response.data.data;
}

export async function createApplication(payload: CreateApplicationInput): Promise<Application> {
  const response = await apiClient.post<{ data: Application }>('/applications', payload);
  return response.data.data;
}

export async function updateApplication(
  id: string,
  payload: UpdateApplicationInput
): Promise<Application> {
  const response = await apiClient.patch<{ data: Application }>(`/applications/${id}`, payload);
  return response.data.data;
}

export async function deleteApplication(id: string): Promise<{ message: string; id: string }> {
  const response = await apiClient.delete<{ message: string; id: string }>(`/applications/${id}`);
  return response.data;
}
