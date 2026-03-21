import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useAuth, useLogin, useRegister } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useState } from "react";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const login = useLogin();
  const register = useRegister();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (isLoading) return null;
  if (user) return <Redirect to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") {
        await login.mutateAsync({
          email: form.email,
          password: form.password,
        });
      } else {
        await register.mutateAsync({
          name: form.name,
          email: form.email,
          password: form.password,
          adminCode: form.adminCode || undefined,
        });
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-lg p-10 relative z-10 text-center rounded-sm shadow-xl border border-ink/10"
      >
        <div className="w-16 h-16 mx-auto bg-ink text-gold flex items-center justify-center rounded-full mb-8 shadow-lg">
          <BookOpen className="w-8 h-8" />
        </div>

        <h1 className="font-display text-3xl font-bold text-ink mb-2">
          Welcome to LIT'ERA
        </h1>
        <p className="font-body text-ink/60 mb-6 text-lg italic">
          Authenticate to access the archives.
        </p>

        <div className="flex justify-center gap-4 mb-6 text-xs font-accent tracking-[0.2em] uppercase">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-4 py-2 border ${
              mode === "login"
                ? "bg-ink text-cream border-ink"
                : "border-ink/20 text-ink/70"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`px-4 py-2 border ${
              mode === "register"
                ? "bg-ink text-cream border-ink"
                : "border-ink/20 text-ink/70"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="font-accent text-[0.7rem] tracking-widest uppercase text-ink">
                Name
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-ink/20 px-3 py-2 font-body text-sm"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="font-accent text-[0.7rem] tracking-widest uppercase text-ink">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-ink/20 px-3 py-2 font-body text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="font-accent text-[0.7rem] tracking-widest uppercase text-ink">
              Password
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border border-ink/20 px-3 py-2 pr-10 font-body text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-ink/50 hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {mode === "register" && (
            <div className="space-y-1">
              <label className="font-accent text-[0.7rem] tracking-widest uppercase text-ink">
                Admin Code (optional)
              </label>
              <input
                type="text"
                value={form.adminCode}
                onChange={(e) =>
                  setForm({ ...form, adminCode: e.target.value })
                }
                className="w-full border border-ink/20 px-3 py-2 font-body text-sm"
              />
              <p className="text-[0.7rem] text-ink/50 font-body">
                First registered user becomes admin automatically.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-rust font-body mt-2 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending || register.isPending}
            className="mt-4 w-full py-4 bg-gold text-ink font-accent font-bold text-sm tracking-[0.2em] uppercase hover:bg-ink hover:text-cream transition-colors duration-300 shadow-md disabled:opacity-60"
          >
            {login.isPending || register.isPending
              ? "Authenticating..."
              : mode === "login"
              ? "Enter Archives"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-ink/10 text-center">
          <p className="font-body text-sm text-ink/50 italic">
            "Enter, stranger, but take heed
            <br />
            Of what awaits the sin of greed."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
