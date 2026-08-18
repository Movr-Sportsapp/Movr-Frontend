import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Event } from "../types/Event";
import type { Sport } from "../types/Sport";
import { getEvents, getSports } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import UserLocation from "../hooks/userLocation";
import { geocodeAddress } from "../services/geocode";

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [count, setCount] = useState(0);

  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const [addressInput, setAddressInput] = useState("");
  const [addressLoading, setaddressLoading] = useState(false);
  const [addressError, setaddressError] = useState<string | null>(null);

  const [radiusKm, setRadiusKm] = useState(5);
  const {
    location,
    error: locationError,
    loading: locationLoading,
    requestLocation,
    clearLocation,
    setLocationManually,
  } = UserLocation();

  useEffect(() => {
    (async () => {
      try {
        setSports(await getSports());
      } catch {
        // filter just won't have extra options
      }
    })();
  }, []);

  const handleAddressSearch = async () => {
    if (!addressInput.trim()) return;

    setaddressLoading(true);
    setaddressError(null);

    try {
      const result = await geocodeAddress(`${addressInput}, Germany`); //
      if (result) {
        setLocationManually(result.lat, result.lng);
      } else {
        clearLocation();
        setaddressError(
          "Could not fond that address - try being more specific.",
        );
      }
    } catch (err) {
      setaddressError(
        err instanceof Error ? err.message : "Something went wrong :( ",
      );
    } finally {
      setaddressLoading(false);
    }
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEvents({
        status: "active",
        ...(city ? { city } : {}),
        ...(date ? { date } : {}),
        ...(selectedSport ? { sport: selectedSport } : {}),
        ...(location
          ? { lat: location.lat, lng: location.lng, radius: radiusKm }
          : {}),
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
  }, [fetchEvents]);

  return (
    <div className="min-h-screen bg-black text-white ">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          BROWSE ACTIVITIES
        </h1>  
        {/* Sticky search + filters */}
        <div className="bg-black pt-3 pb-3 flex flex-col gap-2">
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
          >
            <option value="">All Cities</option>
            <option value="Berlin">Berlin</option>
            <option value="Munich">Munich</option>
            <option value="Hamburg">Hamburg</option>
            <option value="London">London</option>
            <option value="Vienna">Vienna</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
          />

          {/* Address search */}
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Search by address"
              placeholder="...e.g. Alexanderplatz 1, 10178 Berlin"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddressSearch();
                }
              }}
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <button
              onClick={handleAddressSearch}
              disabled={addressLoading}
              aria-busy={addressLoading}
              className="shrink-0 px-4 py-2 rounded-full bg-lime-400 text-black text-sm font-medium disabled:opacity-60"
            >
              {addressLoading ? "Searching…" : "Search"}
            </button>
          </div>
          {addressError && (
            <p role="alert" className="text-red-400 text-xs">
              {addressError}
            </p>
          )}

          {/* Near me + radius */}
          <div className="flex gap-2 items-center">
            <button
              onClick={requestLocation}
              className={`shrink-0 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
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
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm"
              >
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
                <option value={20}>20 km</option>
              </select>
            )}
          </div>
          {locationError && (
            <p role="alert" className="text-red-400 text-xs">
              {locationError}
            </p>
          )}

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
            <button
              onClick={() => setSelectedSport("")}
              className={`shrink-0 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
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
                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
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
        <div className="py-4">
          <div className="flex items-center justify-between mb-4 pt-2">
            <div>
              <h1 className=" text-2xl font-black tracking-tight uppercase">
                All Activities
              </h1>
              <p className="text-sm text-neutral-400">
                {loading
                  ? "Loading…"
                  : `${events.length} of ${count} activities found`}
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
            <p
              role="alert"
              className="rounded-xl bg-red-950 text-red-400 text-sm px-4 py-3 mb-4"
            >
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
          ) : !error && events.length === 0 ? (
            <p className="text-center text-neutral-500 py-16">
              No activities found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
