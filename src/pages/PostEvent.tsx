import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { type Sport } from "../types/Sport.ts";
import { getSports, createEvent } from "../api/eventApi.ts";
import { useAuth } from "../context/AuthContext";
import {
  getSportEmoji,
  getSportColor,
  getSportImage,
} from "../assets/sports.ts";
import { geocodeAddress } from "../services/geocode.ts";

const LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
] as const;

type Level = (typeof LEVELS)[number];

type Location = {
  address: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

type FormState = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: Location;
  skillLevel: Level;
  maxParticipants: number;
  isPublic: boolean;
  womenOnly: boolean;
  flintaOnly: boolean;
};

const initialForm: FormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: {
    address: "",
    city: "",
    coordinates: undefined,
  },
  skillLevel: "Beginner",
  maxParticipants: 10,
  isPublic: true,
  womenOnly: false,
  flintaOnly: false,
};

type FormErrors = Partial<Record<keyof FormState | "sport" | "city", string>>;

export interface PostActivityPayload extends Omit<FormState, "location"> {
  /** The sport's id (not the full Sport object or its name) — matches Event.create's `sport` ref field. */
  sport: string;
  location: Location;
}

interface Organizer {
  name: string;
  profileImage?: string;
}

interface PostActivityPageProps {
  /** Optional hook fired after the event is successfully created (e.g. for analytics, toasts). */
  onSuccess?: (createdEvent: unknown) => void | Promise<void>;
}

const ACCENT = "#c3f53c";

export default function PostActivityPage({ onSuccess }: PostActivityPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth(); // adjust field names to match your auth user shape
  const organizer: Organizer = {
    name: user?.firstName
      ? `${user.firstName} ${user.lastName ?? ""}`.trim()
      : "You",
    profileImage: user?.profileImage ?? undefined,
  };
  const [sports, setSports] = useState<Sport[]>([]);
  const [sportsLoading, setSportsLoading] = useState(true);
  const [sportsError, setSportsError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [geocodeStatus, setGeocodeStatus] = useState<
    "idle" | "loading" | "resolved" | "error"
  >("idle");

  useEffect(() => {
    let cancelled = false;

    async function loadSports() {
      try {
        setSportsLoading(true);
        setSportsError(null);
        const data = await getSports();
        if (!cancelled) setSports(data);
      } catch {
        if (!cancelled) setSportsError("Couldn't load sports. Try refreshing.");
      } finally {
        if (!cancelled) setSportsLoading(false);
      }
    }

    loadSports();
    return () => {
      cancelled = true;
    };
  }, []);

  const sport = useMemo(
    () => sports.find((s) => s.id === selectedSport) ?? null,
    [sports, selectedSport],
  );

  // Debounced geocoding: resolve coordinates from the typed address ~600ms
  // after the user stops typing, instead of firing a request on every
  // keystroke. Coordinates are nested under location.coordinates to match
  // the Location type — writing location.latitude/location.longitude
  // directly (the previous bug) silently missed the actual field and left
  // location.coordinates stuck at its initial value.
  useEffect(() => {
    const address = form.location.address.trim();
    if (!address) {
      setGeocodeStatus("idle");
      return;
    }

    setGeocodeStatus("loading");
    const timeout = setTimeout(async () => {
      try {
        const result = await geocodeAddress(address);
        if (result) {
          setForm((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { latitude: result.lat, longitude: result.lng },
            },
          }));
          setGeocodeStatus("resolved");
          setErrors((prev) => ({ ...prev, location: undefined }));
        } else {
          setForm((prev) => ({
            ...prev,
            location: { ...prev.location, coordinates: undefined },
          }));
          setGeocodeStatus("error");
        }
      } catch {
        setForm((prev) => ({
          ...prev,
          location: { ...prev.location, coordinates: undefined },
        }));
        setGeocodeStatus("error");
      }
    }, 600);

    return () => clearTimeout(timeout);
    // Only re-run when the address text itself changes.
  }, [form.location.address]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setLocationAddress = (address: string) => {
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, address, coordinates: undefined },
    }));
    if (errors.location)
      setErrors((prev) => ({ ...prev, location: undefined }));
  };

  const setLocationCity = (city: string) => {
    setForm((prev) => ({ ...prev, location: { ...prev.location, city } }));
    if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!selectedSport) next.sport = "Choose a sport to continue";
    if (!form.title.trim()) next.title = "Give your activity a title";
    if (!form.date) next.date = "Pick a date";
    if (!form.time) next.time = "Pick a start time";
    if (!form.location.address.trim()) {
      next.location = "Add a meeting point";
    } else if (!form.location.coordinates) {
      next.location = "We couldn't locate that address — try refining it";
    }
    if (!form.location.city.trim()) next.city = "Add a city";
    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const { location, ...rest } = form;
    const payload: PostActivityPayload = {
      ...rest,
      location,
      sport: selectedSport as string,
    };

    try {
      setSubmitting(true);
      setSubmitError(null);
      const createdEvent = await createEvent(payload);
      if (onSuccess) {
        await onSuccess(createdEvent);
      }
      navigate("/events");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Couldn't post your activity. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const going = 1;
  const spotsLeft = Math.max(form.maxParticipants - going, 0);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p
          className="mb-1 text-xs font-semibold tracking-[0.2em]"
          style={{ color: ACCENT }}
        >
          NEW ACTIVITY
        </p>
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
          POST ACTIVITY
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} noValidate className="min-w-0">
            {/* 01 — sport */}
            <Section step="01" title="Choose your sport">
              {sportsLoading && (
                <p className="text-sm text-gray-500">Loading sports...</p>
              )}

              {sportsError && !sportsLoading && (
                <p className="text-sm text-red-400">{sportsError}</p>
              )}

              {!sportsLoading && !sportsError && (
                <div className="grid grid-cols-3 gap-3">
                  {sports.map((s) => {
                    const isSelected = selectedSport === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedSport(s.id);
                          if (errors.sport)
                            setErrors((prev) => ({
                              ...prev,
                              sport: undefined,
                            }));
                        }}
                        aria-pressed={isSelected}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition ${
                          isSelected
                            ? "border-[#c3f53c] bg-[#1c2008] text-[#c3f53c]"
                            : "border-white/10 bg-[#1a1a1c] text-gray-300 hover:border-white/25"
                        }`}
                        style={
                          isSelected
                            ? {
                                borderColor: getSportColor(s.name),
                                color: getSportColor(s.name),
                              }
                            : undefined
                        }
                      >
                        <span className="text-2xl" aria-hidden="true">
                          {getSportEmoji(s.name)}
                        </span>
                        <span className="font-medium">{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.sport && (
                <p className="mt-3 text-sm text-red-400">{errors.sport}</p>
              )}
            </Section>

            {/* 02 — details */}
            <Section step="02" title="Activity details">
              <div className="flex flex-col gap-4">
                <Field label="Title" required error={errors.title}>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Give your activity a clear, descriptive title"
                    className={inputClass(errors.title)}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Tell people what to expect — pace, gear needed, what happens after. The more detail, the better."
                    rows={4}
                    className={inputClass() + " resize-none"}
                  />
                </Field>
              </div>
            </Section>

            {/* 03 — when & where */}
            <Section step="03" title="When & where">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date" required error={errors.date}>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setField("date", e.target.value)}
                      className={inputClass(errors.date)}
                    />
                  </Field>
                  <Field label="Start time" required error={errors.time}>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setField("time", e.target.value)}
                      className={inputClass(errors.time)}
                    />
                  </Field>
                </div>

                <Field label="Meeting point" required error={errors.location}>
                  <input
                    type="text"
                    value={form.location.address}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="e.g. Treptower Park main entrance, near the..."
                    className={inputClass(errors.location)}
                  />
                  {!errors.location && geocodeStatus === "loading" && (
                    <p className="mt-1 text-xs text-gray-500">
                      Locating address...
                    </p>
                  )}
                  {!errors.location &&
                    geocodeStatus === "resolved" &&
                    form.location.coordinates && (
                      <p className="mt-1 text-xs text-gray-500">
                        📍 {form.location.coordinates.latitude.toFixed(5)},{" "}
                        {form.location.coordinates.longitude.toFixed(5)}
                      </p>
                    )}
                  {!errors.location && geocodeStatus === "error" && (
                    <p className="mt-1 text-xs text-amber-400">
                      Couldn't find that address — try being more specific.
                    </p>
                  )}
                </Field>

                <Field label="City" required error={errors.city}>
                  <input
                    type="text"
                    value={form.location.city}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="Berlin"
                    className={inputClass(errors.city)}
                  />
                </Field>
              </div>
            </Section>

            {/* 04 — settings */}
            <Section step="04" title="Activity settings">
              <Field label="Level">
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((level) => (
                    <PillButton
                      key={level}
                      selected={form.skillLevel === level}
                      onClick={() => setField("skillLevel", level)}
                    >
                      {level}
                    </PillButton>
                  ))}
                </div>
              </Field>

              <div className="mt-6">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium tracking-wide text-gray-400">
                    MAX PARTICIPANTS
                  </label>
                  <span className="text-lg font-bold" style={{ color: ACCENT }}>
                    {form.maxParticipants}
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={100}
                  step={1}
                  value={form.maxParticipants}
                  onChange={(e) =>
                    setField("maxParticipants", Number(e.target.value))
                  }
                  className="w-full accent-[#c3f53c]"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>2 (small group)</span>
                  <span>100 (open event)</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <ToggleRow
                  label="Public event"
                  description="Visible to everyone. Turn off to make it invite-only."
                  checked={form.isPublic}
                  onChange={(checked) => setField("isPublic", checked)}
                />
                <ToggleRow
                  label="Women only"
                  checked={form.womenOnly}
                  onChange={(checked) => setField("womenOnly", checked)}
                />
                <ToggleRow
                  label="FLINTA only"
                  description="Women, Lesbian, Inter, Non-binary, Trans, Agender"
                  checked={form.flintaOnly}
                  onChange={(checked) => setField("flintaOnly", checked)}
                />
              </div>
            </Section>

            {submitError && (
              <p className="mb-3 text-sm text-red-400">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={
                submitting || sportsLoading || geocodeStatus === "loading"
              }
              className="w-full rounded-xl py-3 text-sm font-bold tracking-wide text-[#0d0d0f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: ACCENT }}
            >
              {submitting ? "POSTING..." : "POST ACTIVITY"}
            </button>
          </form>

          {/* Live preview */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gray-400">
              LIVE PREVIEW
            </p>

            <div className="rounded-2xl border border-white/10 bg-[#141416] p-4">
              <div
                className="relative flex h-32 flex-col items-center justify-center rounded-xl bg-[#1a1a1c] bg-cover bg-center"
                style={
                  sport
                    ? {
                        backgroundImage: `linear-gradient(rgba(13,13,15,0.55), rgba(13,13,15,0.55)), url(${getSportImage(sport.name)})`,
                      }
                    : undefined
                }
              >
                <span className="absolute right-2 top-2 rounded-full bg-[#0d0d0f]/80 px-2 py-1 text-xs font-medium text-gray-300">
                  {spotsLeft} spots left
                </span>
                {sport ? (
                  <span className="text-4xl" aria-hidden="true">
                    {getSportEmoji(sport.name)}
                  </span>
                ) : (
                  <>
                    <span className="text-4xl text-gray-600" aria-hidden="true">
                      🏃
                    </span>
                    <span className="mt-2 text-xs text-gray-500">
                      Select a sport to preview
                    </span>
                  </>
                )}
              </div>

              <p
                className={`mt-4 text-sm italic ${
                  form.title
                    ? "not-italic font-medium text-white"
                    : "text-gray-500"
                }`}
              >
                {form.title || "Your title will appear here..."}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2a2d] text-xs text-gray-400">
                  {organizer.profileImage ? (
                    <img
                      src={organizer.profileImage}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <span aria-hidden="true">🙂</span>
                  )}
                </div>
                <span className="text-sm text-gray-300">{organizer.name}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                <span>📅 {form.date || "Date"}</span>
                <span>🕐 {form.time || "Time"}</span>
                <span>📍 {form.location.city || "City"}</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {going} / {form.maxParticipants} going
                </span>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: "#1c2008",
                    color: sport ? getSportColor(sport.name) : ACCENT,
                  }}
                >
                  {form.skillLevel}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-[#141416] p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide">
        <span style={{ color: ACCENT }}>{step}</span>
        <span className="uppercase">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function PillButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        selected
          ? "border-[#c3f53c] bg-[#1c2008] text-[#c3f53c]"
          : "border-white/10 bg-[#1a1a1c] text-gray-300 hover:border-white/25"
      }`}
    >
      {children}
    </button>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-white/10 bg-[#1a1a1c] px-3 py-2.5">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#1a1a1c] accent-[#c3f53c]"
      />
    </label>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-lg border bg-[#1a1a1c] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#c3f53c] ${
    error ? "border-red-400" : "border-white/10"
  }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-xs font-medium tracking-wide text-gray-400">
        <span className="uppercase">{label}</span>
        {required && (
          <span aria-hidden="true" className="text-[10px] text-amber-400">
            •
          </span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
