import type { Event, EventsQuery } from "../types/Event";
import { apiFetch } from "./fetchClient";
import type { Sport } from "../types/Sport";

// GET all events but also GET events with search parameters
export async function getEvents(query: EventsQuery = {}) {

    const params = new URLSearchParams(query as Record<string, string>).toString();

    const body = await apiFetch(`/events?${params}`, {}, true);

    return { count: body.count, events: body.data}
};


export async function getSports(): Promise<Sport[]> {
    return apiFetch('/sport')
};
