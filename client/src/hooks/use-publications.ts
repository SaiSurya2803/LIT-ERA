import { useQuery } from "@tanstack/react-query";

export function usePublications() {
  return useQuery({
    queryKey: ['/api/publications'],
    queryFn: async () => {
      const response = await fetch('/api/publications');
      if (!response.ok) throw new Error('Failed to fetch publications');
      return response.json();
    }
  });
}
