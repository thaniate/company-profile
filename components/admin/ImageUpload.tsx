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
      const message = err instanceof Error ? err.message : "Invalid credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 relative overflow-hidden">
      {/* Checker corners */}
      <div className="absolute top-0 left-0 w-24 h-24 checker opacity-20" />
      <div className="absolute top-0 right-0 w-24 h-24 checker opacity-20" />
      <div className="absolute bottom-0 left-0 w-24 h-24 checker opacity-20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 checker opacity-20" />

      {/* Gingham strips */}
      <div className="absolute top-0 left-0 right-0 gingham-strip" />
      <div className="absolute bottom-0 left-0 right-0 gingham-strip" />

      {/* Floating decorations */}
      <div
        className="absolute top-[20%] left-[8%] text-sangria/10 font-accent pointer-events-none select-none hidden lg:block"
        style={{ fontSize: "8rem", animation: "float-slow 6s ease-in-out infinite" }}
      >
        S
      </div>
      <div
        className="absolute bottom-[20%] right-[8%] text-cornflower/50 font-accent pointer-events-none select-none hidden lg:block"
        style={{ fontSize: "6rem", animation: "float-slow 8s ease-in-out infinite reverse" }}
      >
        ✦
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <span
            className="font-accent text-sangria mb-2"
            style={{ fontSize: "3.5rem", animation: "float-slow 5s ease-in-out infinite" }}
          >
            Studio
          </span>
          <p className="text-sangria/50 text-[0.62rem] font-body font-bold tracking-[0.3em] uppercase">
            Admin Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-off-white border-2 border-sangria/20 p-8 space-y-6 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-sangria -translate-x-1 -translate-y-1" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-sangria translate-x-1 translate-y-1" />

          <div className="border-b-2 border-sangria/10 pb-5">
            <h2 className="font-display font-black text-sangria text-2xl">Sign In</h2>
            <p className="text-muted text-[0.62rem] mt-1 font-body tracking-wide">
              Restricted to authorized personnel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted">
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
              <label className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-sangria transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              data-cursor
              className="w-full bg-sangria text-cream py-3.5 text-[0.65rem] tracking-[0.18em] uppercase font-body font-bold hover:bg-sangria-dark transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-3 group mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sangria/20 text-[0.58rem] font-body font-bold tracking-wider uppercase mt-6">
          © {new Date().getFullYear()} Studio CMS
        </p>
      </div>
    </div>
  );
}