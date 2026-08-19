import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginInput } from "../types/User";

// Inline eye / eye-off icon
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.6 18.6 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginInput>({
    identifier: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.identifier) {
      setError("Email or username required for login");
      return;
    }

    if (!form.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141414] border border-white/5 p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition"
        >
          ✕
        </button>

        <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Sign in to find and join activities near you.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-semibold tracking-wide text-white/40 uppercase mb-1.5"
            >
              Email or username
            </label>
            <input
              id="identifier"
              type="text"
              name="identifier"
              placeholder="you@example.com"
              value={form.identifier}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/60 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wide text-white/40 uppercase mb-1.5"
            >
              Password
            </label>
            {/* NEW: wrap input in relative container + toggle button */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-10 text-sm text-white placeholder-white/30 outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/60 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-lime-400 py-3 text-sm font-bold text-black hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/50">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-lime-400 font-semibold hover:underline"
          >
            Join Movr
          </Link>
        </p>
      </div>
    </div>
  );
}
