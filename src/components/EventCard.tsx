import { Link } from "react-router-dom";
import type { Event } from "../types/Event";
import { useAuth } from "../context/AuthContext";
import { getSportEmoji, getSportColor } from "../assets/sports";
import DefaultAvatar from '../assets/img/default_userAvatar.png';

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

  const sportName = event.sport?.name ?? 'Unknown';
  const sportColor = getSportColor(sportName);

  return (
    <div className="rounded-xl border shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition bg-black"
                           style={{ borderColor: sportColor }}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold"
        style={{ color: sportColor}}
        >{event.title}</h3>
        <span
          className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
          style={{ backgroundColor: `${sportColor}22`, color: sportColor }}
        >
          <span>{getSportEmoji(sportName)}</span>
          {sportName}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3">
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
        <p className="text-sm">Hosted by: </p>
        {/* Avatar only for logged-in users */}
        {user && (
          <img
            src={event.creator.profileImage || DefaultAvatar}
            alt={event.creator.username}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
          />
        )}
        <span className="text-sm ">{event.creator.username}</span>
      </div>

      <p className="text-sm">
        {event.participants.length} / {event.maxParticipants} joining
      </p>

      {/* Link only for logged-in users */}
      {user && (
        <Link
          to={`/events/${event.id}`}
          className={`mt-2 text-center rounded-lg py-2 text-sm font-medium border transition ${
            isFull
              ? "bg-gray-200 text-gray-400 border-transparent"
              : "bg-black text-lime border-lime-400/40" }`}
          style={
            !isFull 
            ? {
                  boxShadow: `
                      0 0 8px rgba(163, 230, 53, 0.5),
                      0 0 20px rgba(163, 230, 53, 0.3),
                      inset 0 0 15px rgba(163, 230, 53, 0.25)
                  `,
              }
            : undefined
          }
        >
          {isFull ? "Full" : "View Details"}
        </Link>
      )}
    </div>
  );
}
