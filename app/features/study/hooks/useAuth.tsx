import { ApiError, api } from "@app/lib/api";
import { QUERY_OPTIONS_SLOW } from "@study/api/queryOptions";
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
        const data = await api.get<{ status: string }>(
          API_ENDPOINTS.CHECK_AUTH
        );

        if (data.status === "COMPLETED") {
          setAuthenticated();
        } else if (data.status === "PENDING") {
          setPending();
        } else {
          setUnauthorized();
        }
        return data;
      } catch (error) {
        if (error instanceof ApiError && [401, 404].includes(error.status)) {
          setUnauthorized();
          return { status: "UNAUTHORIZED" };
        }
        console.error("Auth check failed:", error);
        setUnauthorized();
        throw error;
      }
    },
    ...QUERY_OPTIONS_SLOW,
    retry: (failureCount, error) => {
      // 401(AuthError)은 재시도하지 않음
      if (error instanceof ApiError && [401, 404].includes(error.status)) {
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
