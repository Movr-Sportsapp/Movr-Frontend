import { Link } from "react-router-dom";
import type { Event } from "../types/Event";
import { useAuth } from "../context/AuthContext";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const isFull = event.participants.length >= event.maxParticipants;

  const { loading, user } = useAuth();

  if (loading) return null;

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          {event.sport?.name ?? "Unknown"}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted mb-3">
        <span className="flex items-center gap-1">📅 {formattedDate}</span>
        {/* Time only for logged-in users */}
        {user && (
          <span className="flex items-center gap-1">⏰ {event.time}</span>
        )}
        <span className="flex items-center gap-1 min-w-0">
          📍 <span className="truncate">{event.location.city}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {/* Avatar only for logged-in users */}
        {user && (
          <img
            src={event.creator.profileImage}
            alt={event.creator.username}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
          />
        )}
        <span className="text-sm text-muted">{event.creator.username}</span>
      </div>

      <p className="text-sm">
        {event.participants.length} / {event.maxParticipants} joining
      </p>

      {/* Link only for logged-in users */}
      {user && (
        <Link
          to={`/events/${event.id}`}
          className={`mt-2 text-center rounded-lg py-2 text-sm font-medium ${
            isFull
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isFull ? "Full" : "View Details"}
        </Link>
      )}
    </div>
  );
}
