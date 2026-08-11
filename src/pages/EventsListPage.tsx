import React, {useEffect, useState} from "react";
import type { Event } from "../types/Event";
import { getEvents } from "../api/eventApi";

export default function EventsListPage() {
    const [events, setEvents ] = useState<Event[]>([]);
    const [count, setCount ] = useState(0);
    const [ loading, setLoading] = useState(true);
    const [ error, setError] = useState<string | null>();

    useEffect(() => {

        (async () => {
            try {
                const result = await getEvents(); // { count, events }
                setEvents(result.events);
                setCount(result.count);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong :(');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <p>Loading events...</p>;
    }

    if (error) {
        return <p style={{ color: 'red'}}>{error}</p>
    }

    return (
        <div>
            <h1> Events and activities </h1>
            <p>{count} event{count === 1 ? '' : 's'} found</p>
            {events.length === 0 && <p> No events yet!</p>}

            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <h2>{event.title}</h2>
                        <p>
                            {event.sport} | {event.location.city} | {''}
                            {new Date(event.date).toLocaleString()}
                        </p>
                        <p>
                            {event.participants.length} / {event.maxParticipants} joined
                        </p>
                        <p> 
                            Hosted by {event.creator}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}