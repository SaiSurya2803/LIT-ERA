import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useContent() {
  return useQuery({
    queryKey: [api.content.list.path],
    queryFn: async () => {
      try {
        const response = await fetch(api.content.list.path, {
          credentials: "include"
        });
        
        if (!response.ok) {
          console.error("Content fetch failed with status:", response.status);
          return [];
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Content fetch error:", error);
        return [];
      }
    },
    retry: 1,
    staleTime: 1000 * 30, // 30 seconds instead of 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
