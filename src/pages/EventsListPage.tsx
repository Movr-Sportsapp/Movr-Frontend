import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Event } from "../types/Event";
import type { Sport } from "../types/Sport";
import { getEvents, getSports } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import UserLocation from "../hooks/userLocation";

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [count, setCount] = useState(0);

  const [search, setSearch] = useState(""); // client-side only — EventsQuery has no text search
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const [radiusKm, setRadiusKm ] = useState(10);
  const { location, error: locationError, loading: locationLoading, requestLocation, clearLocation } = UserLocation();

  useEffect(() => {
    (async () => {
      try {
        setSports(await getSports());
      } catch {
        // filter just won't have extra options
      }
    })();
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEvents({
        status: "active",
        ...(city ? { city } : {}),
        ...(date ? { date } : {}),
        ...(selectedSport ? { sport: selectedSport } : {}),
        ...(location ? {lat: location.lat, lng: location.lng, radiusKm } : {}),
      });
      setEvents(result.events);
      setCount(result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong :(");
    } finally {
      setLoading(false);
    }
  }, [city, date, selectedSport, location, radiusKm]);

  const handleCityChange = (value: string) => {
    setCity(value);
    if (value) clearLocation();
  };

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-filter-change, not a cascading update
  }, [fetchEvents]);

  // Title search happens client-side since the API doesn't support it
  const visibleEvents = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.trim().toLowerCase();
    return events.filter((e) => e.title.toLowerCase().includes(q));
  }, [events, search]);

  return (
    <div className="min-h-screen bg-black text-white ">
      <div className="max-w-3xl mx-auto px-4">
        {/* Sticky search + filters */}
        <div className="sticky top-16 z-10 bg-black pt-6 pb-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search activities or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />

          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
          >
            <option value="">All Cities</option>
            <option value="Berlin">Berlin</option>
            <option value="Munich">Munich</option>
            <option value="Hamburg">Hamburg</option>
            <option value="London">London</option>
            <option value="Vienna">Vienna</option>
            
          </select>
          <div className="flex gap-2 items-center">
  <button
    onClick={requestLocation}
    className={`shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition ${
      location
        ? "bg-lime-400 border-lime-400 text-black"
        : "bg-neutral-900 border-neutral-700 text-neutral-300"
    }`}
  >
    📍 {locationLoading ? "Locating…" : "Near me"}
  </button>

  {location && (
    <select
      value={radiusKm}
      onChange={(e) => setRadiusKm(Number(e.target.value))}
      className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
    >
      <option value={5}>5 km</option>
      <option value={10}>10 km</option>
      <option value={25}>25 km</option>
    </select>
  )}
</div>

{locationError && (
  <p className="text-red-400 text-sm">{locationError}</p>
)}

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
          />

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-5">
            <button
              onClick={() => setSelectedSport("")}
              className={`shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition ${
                selectedSport === ""
                  ? "bg-lime-400 border-lime-400 text-black"
                  : "bg-neutral-900 border-neutral-700 text-neutral-300"
              }`}
            >
              All
            </button>
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-medium transition ${
                  selectedSport === sport.id
                    ? "bg-lime-400 border-lime-400 text-black"
                    : "bg-neutral-900 border-neutral-700 text-neutral-300"
                }`}
              >
                {sport.icon} {sport.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className=" text-2xl font-black tracking-tight uppercase">
                All Activities
              </h1>
              <p className="text-sm text-neutral-400">
                {loading
                  ? "Loading…"
                  : `${visibleEvents.length} activit${visibleEvents.length === 1 ? "y" : "ies"} found`}
              </p>
            </div>
            {user && (
              <Link
                to="/createevent"
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold bg-lime-400 text-black hover:bg-lime-300"
              >
                + Post Activity
              </Link>
            )}
          </div>

          {error && (
            <p className="rounded-xl bg-red-950 text-red-400 text-sm px-4 py-3 mb-4">
              {error}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-neutral-800 h-64 animate-pulse bg-neutral-900"
                />
              ))}
            </div>
          ) : !error && visibleEvents.length === 0 ? (
            <p className="text-center text-neutral-500 py-16">
              No activities found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
