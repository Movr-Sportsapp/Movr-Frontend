import React, { useState } from "react";
import type { SignUpInput } from "../types/User";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GENDERS: { value: SignUpInput["gender"]; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpInput>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "other",
    location: { city: "", country: "" },
  });

  const { signup } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleGenderSelect = (value: SignUpInput["gender"]) =>
    setForm((prev) => ({ ...prev, gender: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !form.firstName ||
      !form.lastName ||
      !form.username ||
      !form.password ||
      !form.confirmPassword ||
      !form.dateOfBirth ||
      !form.gender ||
      !form.email ||
      !form.location.city ||
      !form.location.country
    ) {
      setError("All fields are required!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/60 transition";
  const labelClass =
    "block text-xs font-semibold tracking-wide text-white/40 uppercase mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/60 px-4 py-10">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141414] border border-white/5 p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition"
        >
          ✕
        </button>

        <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
          Join Movr
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Create an account and start moving with others.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstname" className={labelClass}>
                First name
              </label>
              <input
                id="firstname"
                type="text"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastname" className={labelClass}>
                Last name
              </label>
              <input
                id="lastname"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className={labelClass}>
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="birthdate" className={labelClass}>
              Date of birth
            </label>
            <input
              id="birthdate"
              type="date"
              name="dateOfBirth"
              max="2008-08-01"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          <fieldset>
            <legend className={labelClass}>Gender</legend>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map(({ value, label }) => {
                const selected = form.gender === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleGenderSelect(value)}
                    aria-pressed={selected}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
                      selected
                        ? "bg-lime-400 text-black border-lime-400"
                        : "bg-white/5 text-white/60 border-white/10 hover:border-white/25"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className={labelClass}>
                City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="City"
                value={form.location.city}
                onChange={handleLocationChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="country" className={labelClass}>
                Country
              </label>
              <input
                id="country"
                type="text"
                name="country"
                placeholder="Country"
                value={form.location.country}
                onChange={handleLocationChange}
                className={inputClass}
              />
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
            className="w-full mt-2 py-3.5 rounded-xl bg-lime-400 text-black font-bold text-sm tracking-wide hover:bg-lime-300 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/50">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-lime-400 font-semibold hover:underline"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}
