import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import EventCard from "./EventCard";
import { getEvents } from "../api/eventApi";

export default function UpcomingEvents() {

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
        <section className="px-6 py-20 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Upcoming Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    );
}