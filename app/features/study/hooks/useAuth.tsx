import { QUERY_OPTIONS_SLOW } from "@study/api/queryOptions";
import { apiClient } from "@study/lib/apiClient";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import { AuthStatus, useAuthStore } from "@study/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { status, setAuthenticated, setUnauthorized, setPending, setLoading } =
    useAuthStore();

  const { refetch } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      setLoading();
      try {
        const response = await apiClient.get(API_ENDPOINTS.CHECK_AUTH, {
          throwHttpErrors: false,
        });

        if (response.ok) {
          const data = await response.json<{ status: string }>();

          if (data.status === "COMPLETED") {
            setAuthenticated();
          } else if (data.status === "PENDING") {
            setPending();
          } else {
            setUnauthorized();
          }
          return data;
        } else {
          if (response.status === 401 || response.status === 404) {
            setUnauthorized();
            return { status: "UNAUTHORIZED" };
          }
          throw new Error("Authentication check failed");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (!(error instanceof Error && error.name === "AuthError")) {
          setUnauthorized();
        }
        throw error;
      }
    },
    ...QUERY_OPTIONS_SLOW,
    retry: (failureCount, error) => {
      // 401(AuthError)은 재시도하지 않음
      if (error instanceof Error && error.name === "AuthError") {
        return false;
      }
      // 다른 오류는 2번까지 재시도
      return failureCount < 2;
    },
    enabled: status === AuthStatus.LOADING,
  });

  return {
    status,
    isLoading: status === AuthStatus.LOADING,
    isAuthenticated: status === AuthStatus.AUTHENTICATED,
    isUnauthorized: status === AuthStatus.UNAUTHORIZED,
    isPending: status === AuthStatus.PENDING,
    checkAuth: refetch,
  };
};

export default useAuth;
