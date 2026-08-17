import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      return api.auth.me.responses[200].parse(data);
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin ?? false,
    error,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      email: string;
      password: string;
    }) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        let errorMsg = "";
        try {
          const body = await res.json();
          if (body && body.message) {
            errorMsg = body.message;
          }
        } catch {
          try {
            const raw = await res.text();
            if (raw && !raw.startsWith("<!DOCTYPE")) {
              errorMsg = raw.slice(0, 150);
            }
          } catch {}
        }
        throw new Error(errorMsg || `Login failed (${res.status})`);
      }
      const data = await res.json();
      return api.auth.login.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data);
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      password: string;
      adminCode?: string;
    }) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        let errorMsg = "";
        try {
          const body = await res.json();
          if (body && body.message) {
            errorMsg = body.message;
          }
        } catch {
          try {
            const raw = await res.text();
            if (raw && !raw.startsWith("<!DOCTYPE")) {
              errorMsg = raw.slice(0, 150);
            }
          } catch {}
        }
        throw new Error(errorMsg || `Registration failed (${res.status})`);
      }
      const data = await res.json();
      return api.auth.register.responses[201].parse(data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data);
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}
