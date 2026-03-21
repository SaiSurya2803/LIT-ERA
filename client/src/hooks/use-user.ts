import { useAuth } from "./use-auth";

export function useUser() {
  const { user, isLoading, error } = useAuth();
  
  return {
    data: user,
    isLoading,
    error,
  };
}
