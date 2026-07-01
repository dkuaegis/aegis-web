import StudyApp from "@study/App";
import { ToastProvider } from "@study/components/ui/useToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@study/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function StudyRoute() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StudyApp />
      </ToastProvider>
    </QueryClientProvider>
  );
}
