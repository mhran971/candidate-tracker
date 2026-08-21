import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes data freshness
      gcTime: 1000 * 60 * 10, // 10 minutes cache retention
      retry: (failureCount, error: unknown) => {
        // Do not retry on 4xx client errors
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
