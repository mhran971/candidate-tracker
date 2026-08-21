import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchApplications,
  fetchApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/api/applications';
import {
  ApplicationQuery,
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationWithCandidate,
  PaginatedResult,
} from '@candidate-tracker/shared';
import { toast } from 'sonner';

export const APPLICATION_KEYS = {
  all: ['applications'] as const,
  lists: () => [...APPLICATION_KEYS.all, 'list'] as const,
  list: (params: ApplicationQuery) => [...APPLICATION_KEYS.lists(), params] as const,
  details: () => [...APPLICATION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...APPLICATION_KEYS.details(), id] as const,
};

export function useApplications(params: ApplicationQuery) {
  return useQuery({
    queryKey: APPLICATION_KEYS.list(params),
    queryFn: () => fetchApplications(params),
  });
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: APPLICATION_KEYS.detail(id || ''),
    queryFn: () => fetchApplication(id!),
    enabled: Boolean(id),
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApplicationInput) => createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Application created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create application');
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateApplicationInput }) =>
      updateApplication(id, payload),
    onMutate: async ({ id, payload }) => {
      // Optimistic update for status changes
      await queryClient.cancelQueries({ queryKey: APPLICATION_KEYS.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: APPLICATION_KEYS.lists() });

      queryClient.setQueriesData<PaginatedResult<ApplicationWithCandidate>>(
        { queryKey: APPLICATION_KEYS.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) => (item.id === id ? { ...item, ...payload } : item)),
          };
        }
      );

      return { previousData };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Application updated successfully');
    },
    onError: (error: Error, _vars, context) => {
      // Rollback on optimistic update failure
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error(error.message || 'Failed to update application');
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Application deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete application');
    },
  });
}
