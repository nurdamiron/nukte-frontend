import { QueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    },
    mutations: {
      onError: (error: any) => {
        notifications.show({
          title: 'Ошибка',
          message: error.message || 'Произошла ошибка при выполнении операции',
          color: 'red',
        });
      },
    },
  },
});