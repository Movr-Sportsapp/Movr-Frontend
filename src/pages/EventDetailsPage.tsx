import { EventLocationMap } from "../components/EventLocationMap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/fetchClient";
import { getSportEmoji, getSportColor, getSportImage } from "../assets/sports";
import type { Event } from "../types/Event";

function TagPill({ children} : { children: React.ReactNode}) {
    return (
        <span className="inline-flex items-center rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-1 text-xs font-medium text-lime-300">
            {children}
        </span>
    );
}

export function EventDetailsPage() {
    const { eventId } = useParams<{ eventId: string}>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading ] = useState(true);
    const [error, setError ] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) return;
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const data = await apiFetch('/events/${eventId}', {}, true);
                if (!cancelled) setEvent(data.data);
            } catch {
                if(!cancelled) setError('Could not load this event. Please try again in a moment.')
            } finally {
              if(!cancelled) setLoading(false);
        }
        })();

        return () => { cancelled = true };
    }, [eventId]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading event…</div>;
    if (error || !event) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error ?? "Event not found."}</div>;

    const sportName = event.sport?.name ?? 'Unknown';
    const spotsLeft = event.maxParticipants - event.participants.length;
    const isFull = spotsLeft <= 0;
    const isInactive = event.status !== 'active';

    return (
        <div className="min-h-screen bg-black text-white">
      {isInactive && (
        <div className="bg-white/10 py-2 text-center text-sm text-white/70">
          This event is {event.status}.
        </div>
      )}
      {/* HERO SECTION */}
      <div
        className="relative h-72 w-full bg-cover bg-center sm:h-96"
        style={{ backgroundImage: `url(${getSportImage(sportName)})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xl">{getSportEmoji(sportName)}</span>
            <span
              className="text-sm uppercase tracking-wide"
              style={{ color: getSportColor(sportName) }}
            >
              {sportName}
            </span>
          </div>
          <h1 className="text-3xl font-bold sm:text-5xl">{event.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          <TagPill>{event.skillLevel}</TagPill>
          {event.womenOnly && <TagPill>Women only</TagPill>}
          {event.flintaOnly && <TagPill>FLINTA only</TagPill>}
          {/* TODO: no `isRecurring` field on Event yet — add here once backend supports it */}
        </div>

        {/* Date / spots / CTA */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-medium">
              {new Date(event.date).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            {/* time not live in backend yet — falls back quietly */}
            {event.time && <p className="text-white/60">{event.time} Uhr</p>}
            <p className="mt-1 text-sm text-white/60">
              {spotsLeft} of {event.maxParticipants} spots left
              {isFull && <span className="ml-2 text-red-400">(Full)</span>}
            </p>
          </div>
          <button
            disabled={isFull || isInactive}
            className="rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            {isFull ? "Event full" : "Join activity"}
          </button>
        </div>

        {/* Host */}
        <div className="mb-8 flex items-center gap-3">
          <img src={event.creator.profileImage} alt={event.creator.username} className="h-11 w-11 rounded-full object-cover" />
          <div>
            <p className="text-sm text-white/60">Hosted by</p>
            <p className="font-medium">{event.creator.username}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">About this event</h2>
          <p className="whitespace-pre-line text-white/80">{event.description}</p>
        </div>

        {/* Location + map */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Meeting point</h2>
          <p className="text-white/80">{event.location.city}</p>
          <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {event.location.coordinates ? (
              <EventLocationMap
                lat={event.location.coordinates.latitude}
                lng={event.location.coordinates.longitude}
                label={event.title} 
                />
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">No exact location given by Host</div>
            )}
          </div>
        </div>

        {/* Who's going */}
        <div>
  <h2 className="mb-3 text-lg font-semibold">Who's going</h2>
  <div className="flex -space-x-3">
    {event.participants.slice(0, 8).map((participants, i) =>
      typeof participants.user === "string" ? (
        // If backend hasn't populated participants yet — fallback placeholder
        <div key={i} className="h-9 w-9 rounded-full border-2 border-black bg-white/10" />
      ) : (
        <img
          key={participants.user.id}
          src={participants.user.profileImage}
          alt={participants.user.username}
          title={participants.user.username}
          className="h-9 w-9 rounded-full border-2 border-black object-cover"
        />
      )
    )}
  </div>
  {event.participants.length > 8 && (
    <span className="ml-2 text-sm text-white/60">+{event.participants.length - 8} more</span>
  )}
</div>
      </div>
    </div>
  );
}
