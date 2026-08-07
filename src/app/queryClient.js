import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes data fresh time
      gcTime: 1000 * 60 * 30,    // 30 minutes garbage collection (formerly cacheTime)
      retry: 1,                  // Retry failed requests once before showing error UI
      refetchOnWindowFocus: false, // Prevents aggressive re-fetching on tab switch
    },
    mutations: {
      retry: 0,
    },
  },
});