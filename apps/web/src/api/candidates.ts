import { apiClient } from './client';
import {
  Candidate,
  CreateCandidateInput,
  UpdateCandidateInput,
  CandidateQuery,
  PaginatedResult,
  Application,
} from '@candidate-tracker/shared';

export interface CandidateWithApplications extends Candidate {
  applications: Application[];
}

export interface CandidateListItem extends Candidate {
  _count?: {
    applications: number;
  };
}

export async function fetchCandidates(
  params: CandidateQuery
): Promise<PaginatedResult<CandidateListItem>> {
  const response = await apiClient.get<PaginatedResult<CandidateListItem>>('/candidates', {
    params,
  });
  return response.data;
}

export async function fetchCandidate(id: string): Promise<CandidateWithApplications> {
  const response = await apiClient.get<{ data: CandidateWithApplications }>(`/candidates/${id}`);
  return response.data.data;
}

export async function createCandidate(payload: CreateCandidateInput): Promise<Candidate> {
  const response = await apiClient.post<{ data: Candidate }>('/candidates', payload);
  return response.data.data;
}

export async function updateCandidate(id: string, payload: UpdateCandidateInput): Promise<Candidate> {
  const response = await apiClient.patch<{ data: Candidate }>(`/candidates/${id}`, payload);
  return response.data.data;
}

export async function deleteCandidate(id: string): Promise<{ message: string; id: string }> {
  const response = await apiClient.delete<{ message: string; id: string }>(`/candidates/${id}`);
  return response.data;
}
