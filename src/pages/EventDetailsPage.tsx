import { EventLocationMap } from "../components/EventLocationMap";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/fetchClient";
import { getSportEmoji, getSportColor, getSportImage } from "../assets/sports";
import { joinEvent, leaveEvent } from "../api/eventApi.ts";
import type { Event } from "../types/Event";
import { useAuth } from "../context/AuthContext.tsx";
import SpotsCard from "../components/spotCard.tsx";
import DefaultAvatar from '../assets/img/default_userAvatar.png';

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-1 text-xs font-medium text-lime-300">
      {children}
    </span>
  );
}

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  //for contacting host (mock form)
  const [ showContactForm, setShowContactForm ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ sent, setSent ] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
   
        setSent(true);

        setTimeout(() => {
          setSent(false);
          setMessage('');
          setShowContactForm(false);
         }, 1500);
  };

  const handleCancel = () => {
    setMessage('');
    setShowContactForm(false);
  };

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/events/${eventId}`, {}, true);
        if (!cancelled) setEvent(data.data);
      } catch {
        if (!cancelled)
          setError("Could not load this event. Please try again in a moment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // console.log(user);
  const isJoined = !!(
    user &&
    event?.participants.some((p) =>
      typeof p.user === "string" ? p.user === user.id : p.user.id === user.id,
    )
  );

  async function handleJoinToggle() {
    if (!user) {
      navigate("/login", { state: { from: `/events/${eventId}` } });
      return;
    }
    setJoining(true);
    setJoinError(null);
    try {
      const res = isJoined
        ? await leaveEvent(eventId!)
        : await joinEvent(eventId!);
      setEvent(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message: 'Something went wrong :( ');
      setJoinError(
        isJoined
          ? "Could not leave this event. Please try again."
          : "Could not join this event. Please try again.",
      );
    } finally {
      setJoining(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading event…
      </div>
    );
  if (error || !event)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {error ?? "Event not found."}
      </div>
    );

  const sportName = event.sport?.name ?? "Unknown";
  const spotsLeft = event.maxParticipants - event.participants.length;
  const isFull = spotsLeft <= 0;
  const isInactive = event.status !== "active";
  const isHost = user?.id === event.creator.id;

  return (
    <div className="min-h-screen bg-black text-white">
    <h1 className="mb-6 pl-4 pt-6 text-3xl font-extrabold tracking-tight">
          EVENT DETAILS
        </h1>  
      {isInactive && (
        <div className="bg-white/10 py-2 text-center text-sm text-white/70">
          This event is {event.status}.
        </div>
      )}
      {/* HERO SECTION */}
      <div
        className="relative h-40 w-full bg-cover bg-center sm:h-96"
        style={{ backgroundImage: `url(${getSportImage(sportName)})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/80  via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xl">{getSportEmoji(sportName)}</span>
            <span
              className="text-sm tracking-wide"
              style={{ color: getSportColor(sportName) }}
            >
              {sportName}
            </span>
          </div>
          <h1 className="font-display font-black uppercase text-4xl md:text-5xl lg:text-6xl tracking-[-0.015em] text-white leading-[0.9] mb-5">
            {event.title}
          </h1>
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
            <SpotsCard
              filled={event.participants.length}
              total={event.maxParticipants}
              sportName={event.sport?.name ?? 'Unknown'}
            />
            <p className="text-lg font-medium">
              📅{" "}
              {new Date(event.date).toLocaleDateString("de-DE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {/* time not live in backend yet — falls back quietly */}
              {event.time && (
                <span className="flex items-center gap-1.5">
                  {" "}
                  ⏰ {event.time} Uhr
                </span>
              )}
              <span className="flex items-center gap-1.5">
                📍 {event.location.city}
              </span>
            </div>
          </div>
          <button
            onClick={handleJoinToggle}
            disabled={
              joining || isHost || (!isJoined && (isFull || isInactive))
            }
            className={
              isJoined
                ? "group rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-red-400/60 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                : "rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
            }
          >
            {joining
              ? isJoined
                ? "Leaving…"
                : "Joining…"
              : isHost
                ? "You're hosting"
                : isJoined
                  ? "Leave Event"
                  : isFull
                    ? "Event full"
                    : "Join Event"}
          </button>
          {joinError && (
            <p className="mt-2 text-sm text-red-400">{joinError}</p>
          )}
        </div>

        {/* Host */}
        <div className="mb-8 flex items-center gap-3">
          <img
            src={event.creator.profileImage || DefaultAvatar}
            alt={event.creator.username}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-white/60">Hosted by</p>
            <p className="font-medium">{event.creator.username}</p>
          </div>
        </div>

        {/* Mock Contact Button and form to send host a message */}
      {isJoined && !isHost && (
  <div className="mb-8">
    {!showContactForm ? (
      <button
        onClick={() => setShowContactForm(true)}
        className="px-4 py-2 rounded-lg text-sm font-medium  border border-white/20  bg-white/5"
        style={{ color: getSportColor(sportName)}}>
        Contact host
      </button>
    ) : sent ? (
      <p className="text-sm" style={{ color: getSportColor(sportName) }}>
        Message sent to {event.creator.username}! 🎉
      </p>
    ) : (
      <div className="flex flex-col gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask ${event.creator.username} a question...`}
          rows={3}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg text-sm font-medium text-black"
            style={{ backgroundColor: getSportColor(sportName) }}
          >
            Send
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-white/20 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
)}  

        {/* Description */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-lime-400 uppercase">
            Description
          </h2>
          <p className="whitespace-pre-line text-white/80">
            {event.description}
          </p>
        </div>

        {/* Location + map */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-lime-400 uppercase">
            Meeting point
          </h2>
          <p className="text-white/80">📍 {event.location.city}</p>
          <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {event.location.coordinates ? (
              <EventLocationMap
                lat={event.location.coordinates.latitude}
                lng={event.location.coordinates.longitude}
                label={event.title}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">
                No exact location given by Host
              </div>
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
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-black bg-white/10"
                />
              ) : (
                <img
                  key={participants.user.id}
                  src={participants.user.profileImage || DefaultAvatar}
                  alt={participants.user.username}
                  title={participants.user.username}
                  className="h-9 w-9 rounded-full border-2 border-black object-cover"
                />
              ),
            )}
          </div>
          {event.participants.length > 8 && (
            <span className="ml-2 text-sm text-white/60">
              +{event.participants.length - 8} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
