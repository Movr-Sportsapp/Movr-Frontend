import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginInput } from "../types/User";

export default function LoginPage() {
  const [form, setForm] = useState<LoginInput>({
    identifier: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        {/* Close button */}
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
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/60 transition"
            />
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
