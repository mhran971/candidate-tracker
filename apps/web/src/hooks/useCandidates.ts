import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCandidates,
  fetchCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '@/api/candidates';
import { CandidateQuery, CreateCandidateInput, UpdateCandidateInput } from '@candidate-tracker/shared';
import { toast } from 'sonner';

export const CANDIDATE_KEYS = {
  all: ['candidates'] as const,
  lists: () => [...CANDIDATE_KEYS.all, 'list'] as const,
  list: (params: CandidateQuery) => [...CANDIDATE_KEYS.lists(), params] as const,
  details: () => [...CANDIDATE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CANDIDATE_KEYS.details(), id] as const,
};

export function useCandidates(params: CandidateQuery) {
  return useQuery({
    queryKey: CANDIDATE_KEYS.list(params),
    queryFn: () => fetchCandidates(params),
  });
}

export function useCandidate(id: string | undefined) {
  return useQuery({
    queryKey: CANDIDATE_KEYS.detail(id || ''),
    queryFn: () => fetchCandidate(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCandidateInput) => createCandidate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Candidate created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create candidate');
    },
  });
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCandidateInput }) =>
      updateCandidate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CANDIDATE_KEYS.detail(data.id) });
      toast.success('Candidate updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update candidate');
    },
  });
}

export function useDeleteCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Candidate soft-deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete candidate');
    },
  });
}
