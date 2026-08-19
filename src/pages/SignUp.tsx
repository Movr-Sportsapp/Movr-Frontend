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

const PASSWORD_CHECKS = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (pw: string) => pw.length >= 8,
  },
  {
    key: "lower",
    label: "One lowercase letter",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    key: "upper",
    label: "One uppercase letter",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    key: "number",
    label: "One number",
    test: (pw: string) => /[0-9]/.test(pw),
  },
];

// Simple inline eye / eye-off icons
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

function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
      {PASSWORD_CHECKS.map(({ key, label, test }) => {
        const passed = test(password);
        return (
          <li key={key} className={passed ? "text-lime-400" : "text-white/40"}>
            {passed ? "✓" : "○"} {label}
          </li>
        );
      })}
    </ul>
  );
}

type FieldErrors = Partial<
  Record<keyof SignUpInput | "confirmPassword" | "city" | "country", string>
>;

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
  const [formError, setFormError] = useState<string | null>(null); // non-field-specific (e.g. network/server error)
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear that field's error as soon as the user edits it
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleGenderSelect = (value: SignUpInput["gender"]) =>
    setForm((prev) => ({ ...prev, gender: value }));

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!form.firstName) next.firstName = "First name is required";
    if (!form.lastName) next.lastName = "Last name is required";
    if (!form.username) next.username = "Username is required";
    if (!form.email) next.email = "Email is required";
    if (!form.dateOfBirth) next.dateOfBirth = "Date of birth is required";
    if (!form.location.city) next.city = "City is required";
    if (!form.location.country) next.country = "Country is required";

    if (!form.password) {
      next.password = "Password is required";
    } else {
      const failed = PASSWORD_CHECKS.find((c) => !c.test(form.password));
      if (failed) next.password = failed.label + " is required";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err: any) {
      // If the backend returns { errors: { field: message } }, map it to the same
      // errors state so it renders under the right input.
      const backendFieldErrors = err?.response?.data?.errors;
      if (backendFieldErrors && typeof backendFieldErrors === "object") {
        setErrors(backendFieldErrors);
      } else {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setFormError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const baseInputClass =
    "w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-1 transition";
  const okBorder =
    "border-white/10 focus:border-lime-400/60 focus:ring-lime-400/60";
  const errBorder =
    "border-red-500/70 focus:border-red-500 focus:ring-red-500/60";
  const inputClass = (field: keyof FieldErrors) =>
    `${baseInputClass} ${errors[field] ? errBorder : okBorder}`;
  const labelClass =
    "block text-xs font-semibold tracking-wide text-white/40 uppercase mb-1.5";
  const errorText = (field: keyof FieldErrors) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-400">{errors[field]}</p>
    ) : null;

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

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
                className={inputClass("firstName")}
              />
              {errorText("firstName")}
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
                className={inputClass("lastName")}
              />
              {errorText("lastName")}
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
              className={inputClass("username")}
            />
            {errorText("username")}
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
              className={inputClass("email")}
            />
            {errorText("email")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass("password")} pr-10`}
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
              {errorText("password")}
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass("confirmPassword")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
              {errorText("confirmPassword")}
            </div>
          </div>
          {/* Live checklist, only shown once the user starts typing a password */}
          {form.password && <PasswordChecklist password={form.password} />}
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
              className={`${inputClass("dateOfBirth")} [color-scheme:dark]`}
            />
            {errorText("dateOfBirth")}
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
                className={inputClass("city")}
              />
              {errorText("city")}
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
                className={inputClass("country")}
              />
              {errorText("country")}
            </div>
          </div>
          {formError && (
            <p role="alert" className="text-sm text-red-400">
              {formError}
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
