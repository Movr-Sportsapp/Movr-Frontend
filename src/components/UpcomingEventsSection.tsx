import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import EventCard from "./EventCard";
import { getEvents } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export default function UpcomingEvents() {

    const { user } = useAuth();
    const [ events, setEvents ] = useState<Event[]>([]);
    const [loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        async function loadEvents() {
            try {
                const { events } = await getEvents();
                const now = new Date();
                
                const upcoming = events
                                .filter((event: Event) => new Date(event.date) >= now )
                                .sort((a: Event,b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .slice(0,5); //slices off and shows only top 5
                setEvents(upcoming);
                } catch (err) {
                    const message = err instanceof Error ? err.message: "'Could not load events :( ";
                    setError(message);
                } finally {
                    setLoading(false);
                }
        }
        loadEvents();
    }, []);

    if (loading) return <p className="text-center text-white/50 py-12">Loading upcoming events...</p>;
    if (error) return <p className="text-center text-red-400 py-12">{error}</p>;

    return (
        <section className="px-6 py-14 border-t border-divider">
            <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-lime text-xs font-semibold tracking-widest uppercase mb-2">Happening now</p>
              <h2 className="font-display font-black uppercase leading-none text-white"
                style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '-0.02em' }}>
                UPCOMING<br />ACTIVITIES
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
            <p className="text-lime text-xs font-semibold tracking-widest uppercase mb-3">
                Want to browse more events? 
            </p>
            {user ? (
            <button className="px-8 py-4 rounded-xl bg-lime text-bg font-bold text-base hover:bg-lime/90 active:scale-95 transition-all duration-150 shadow-lg shadow-lime/20">
              <NavLink to='/events'>Browse events</NavLink>
            </button>
          ) : (
            <>
              <button className="px-8 py-4 rounded-xl bg-lime text-bg font-bold text-base hover:bg-lime/90 active:scale-95 transition-all duration-150 shadow-lg shadow-lime/20">
               <NavLink to='/signup'>Join MOVR*</NavLink> 
              </button>
              </>
              )}
              </div>
              </div>
        </section>
    );
}