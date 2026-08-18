import type { Event, EventsQuery } from "../types/Event";
import { apiFetch } from "./fetchClient";
import type { Sport } from "../types/Sport";

// GET all events but also GET events with search parameters
export async function getEvents(query: EventsQuery = {}) {
  const params = new URLSearchParams(
    query as Record<string, string>,
  ).toString();

  const body = await apiFetch(`/events?${params}`, {}, true);

  return { count: body.count, events: body.data };
}

export async function getSports(): Promise<Sport[]> {
  return apiFetch("/sport");
}

export type CreateEventInput = Omit<
  Event,
  "id" | "creator" | "participants" | "status" | "public" | "sport"
> & {
  sport: string; 
};

export async function createEvent(data: CreateEventInput): Promise<Event> {
  return apiFetch("/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function joinEvent(eventId: string): Promise<{ data: Event }> {
  return apiFetch(`/events/${eventId}/join`, { method: "POST" }, true);
}

export async function leaveEvent(eventId: string): Promise<{ data: Event }> {
  return apiFetch(`/events/${eventId}/join`, { method: "DELETE" }, true);
}
