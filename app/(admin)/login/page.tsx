"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      toast.success("Welcome back.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      {/* Background geometry */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-border/20 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-border/10 rounded-full" />
        <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 w-px h-32 bg-gradient-to-t from-gold/20 to-transparent" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-8 h-8 border-2 border-gold rotate-45 mb-5" />
          <h1 className="font-display text-3xl text-cream tracking-widest uppercase">
            Studio
          </h1>
          <p className="text-muted text-xs font-mono tracking-[0.3em] uppercase mt-2">
            Admin Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border p-8 space-y-6">
          <div className="border-b border-border pb-5">
            <h2 className="font-display text-2xl text-cream">Sign In</h2>
            <p className="text-muted text-xs mt-1 font-mono">
              Restricted to authorized personnel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@studio.com"
                required
                autoComplete="email"
                className="input-base"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-background py-3.5 text-sm tracking-widest uppercase font-body font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted/30 text-xs font-mono mt-6 tracking-wider">
          © {new Date().getFullYear()} Studio CMS
        </p>
      </div>
    </div>
  );
}
