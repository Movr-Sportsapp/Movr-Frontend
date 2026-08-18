# Sport Buddy — API contract (v1 / 2.5-week scope)

Base URL (local): `http://localhost:PORT/api`
All request/response bodies are JSON. Auth uses a JWT sent as `Authorization: Bearer <token>`.

Scope for this version: no waitlists, no organizer approval, no recurring events.
Geo-radius search is included — see `GET /events` below.

---

## Conventions

- Timestamps: ISO 8601 strings (`"2026-08-20T18:00:00.000Z"`)
- IDs: MongoDB ObjectId strings
- Every error response has the same shape:

```json
{ "message": "Human readable error message" }
```

- Validation errors (Zod) return `400` with:

```json
{ "message": "Validation failed", "errors": [ { "path": "email", "message": "Invalid email" } ] }
```

- Protected routes (require valid JWT) are marked 🔒. Missing/invalid token → `401`.

---

## Auth

### `POST /auth/signup`
**Request**
```json
{
  "firstName": "Marla",
  "lastName": "Singer",
  "username": "marlas",
  "email": "marla@example.com",
  "password": "min8chars",
  "confirmPassword": "min8chars",
  "dateOfBirth": "1998-04-12",
  "gender": "f"
}
```
`gender` accepts `"m" | "f" | "n" | "other"`. `confirmPassword` is validated to match `password` but is not stored. `profilePicture`, `city`, `location`, and `sportsInterests` are not part of signup — set them afterward via `PATCH /users/me`.

**Response `201`**
```json
{
  "user": {
    "id": "665f...",
    "firstName": "Marla",
    "lastName": "Singer",
    "username": "marlas",
    "email": "marla@example.com",
    "dateOfBirth": "1998-04-12",
    "gender": "f",
    "profilePicture": null,
    "city": null,
    "location": null,
    "sportsInterests": []
  },
  "token": "eyJhbGciOi..."
}
```
**Errors:** `400` validation (including password mismatch), `409` email already in use, `409` username already taken

---

### `POST /auth/login`
**Request** — `identifier` accepts either an email or a username
```json
{ "identifier": "marla@example.com", "password": "min8chars" }
```
```json
{ "identifier": "marlas", "password": "min8chars" }
```
**Response `200`**
```json
{
  "user": {
    "id": "665f...",
    "firstName": "Marla",
    "lastName": "Singer",
    "username": "marlas",
    "email": "marla@example.com",
    "dateOfBirth": "1998-04-12",
    "gender": "f",
    "profilePicture": "https://.../uploaded-image.jpg",
    "city": "Berlin",
    "location": { "lat": 52.52, "lng": 13.405 },
    "sportsInterests": [ { "sport": "climbing", "skillLevel": "intermediate" } ]
  },
  "token": "eyJhbGciOi..."
}
```
**Errors:** `401` invalid credentials

---

## Users 🔒

### `GET /users/me`
**Response `200`**
```json
{
  "id": "665f...",
  "firstName": "Marla",
  "lastName": "Singer",
  "username": "marlas",
  "email": "marla@example.com",
  "dateOfBirth": "1998-04-12",
  "gender": "f",
  "profilePicture": "https://.../uploaded-image.jpg",
  "city": "Berlin",
  "location": { "lat": 52.52, "lng": 13.405 },
  "sportsInterests": [ { "sport": "climbing", "skillLevel": "intermediate" } ],
  "createdAt": "2026-07-01T10:00:00.000Z"
}
```

### `PATCH /users/me`
**Request** (any subset of fields — all fields are editable, including `email`, `username`, `password`, and `dateOfBirth`)
```json
{
  "username": "marla_s",
  "email": "marla.new@example.com",
  "password": "newpassword123",
  "city": "Berlin",
  "location": { "lat": 52.52, "lng": 13.405 },
  "profilePicture": "https://.../new-image.jpg",
  "sportsInterests": [ { "sport": "running", "skillLevel": "beginner" } ]
}
```
`location` is set from the browser's geolocation API on the frontend (`{ lat, lng }`) and used for radius search — see `GET /events`. Changing `password` requires re-hashing server-side; changing `email` or `username` re-checks uniqueness. Consider requiring `currentPassword` in the body when `password` or `email` changes, as a lightweight safeguard — optional for v1 given the timeline.

**Response `200`** — updated user object (same shape as `GET /users/me`)
**Errors:** `400` validation, `409` email or username already in use

---

## Events

### `GET /events`
Public — no login required to browse, but only `public: true` events are returned to unauthenticated requests. Logged-in users (send a valid JWT) see both public and private events.

**Query params (all optional):**
| param | type | example |
|---|---|---|
| `sport` | string | `climbing` |
| `city` | string | `Berlin` |
| `dateFrom` | ISO date | `2026-08-01` |
| `lat` | number | `52.52` |
| `lng` | number | `13.405` |
| `radiusKm` | number | `10` |
| `page` | number, default 1 | `2` |
| `limit` | number, default 20 | `10` |

`lat`/`lng`/`radiusKm` must be provided together — used for a geo-radius search via a MongoDB `2dsphere` index on `Event.location`. When omitted, results aren't distance-filtered. The frontend gets `lat`/`lng` from the browser's geolocation API (or falls back to the user's stored `location`) and passes them here to power "near me" results.

**Response `200`**
```json
{
  "events": [
    {
      "id": "667a...",
      "title": "Sunday morning climbing",
      "sport": "climbing",
      "creator": { "id": "665f...", "username": "marlas" },
      "city": "Berlin",
      "location": { "lat": 52.52, "lng": 13.405 },
      "dateTime": "2026-08-10T09:00:00.000Z",
      "maxParticipants": 6,
      "participantCount": 3,
      "skillLevel": "any",
      "status": "open",
      "public": true,
      "distanceKm": 3.2
    }
  ],
  "page": 1,
  "totalPages": 4
}
```
`distanceKm` is only present when `lat`/`lng` were supplied in the request.

---

### `GET /events/:id`
Public for `public: true` events; `private` events return `404` to unauthenticated requests and to authenticated users who aren't the creator or a participant (avoids leaking that a private event exists).

**Response `200`**
```json
{
  "id": "667a...",
  "title": "Sunday morning climbing",
  "description": "Casual session at Boulderwelt, all welcome.",
  "sport": "climbing",
  "creator": { "id": "665f...", "username": "marlas" },
  "city": "Berlin",
  "location": { "lat": 52.52, "lng": 13.405 },
  "dateTime": "2026-08-10T09:00:00.000Z",
  "maxParticipants": 6,
  "participants": [ { "id": "665f...", "username": "marlas" } ],
  "skillLevel": "any",
  "status": "open",
  "public": true
}
```
**Errors:** `404` not found (or not visible)

---

### `POST /events` 🔒
**Request**
```json
{
  "title": "Sunday morning climbing",
  "description": "Casual session at Boulderwelt, all welcome.",
  "sport": "climbing",
  "city": "Berlin",
  "location": { "lat": 52.52, "lng": 13.405 },
  "dateTime": "2026-08-10T09:00:00.000Z",
  "maxParticipants": 6,
  "skillLevel": "any",
  "public": true
}
```
`public` defaults to `true` if omitted. When `false`, the event is only visible to its creator and current participants (see `GET /events/:id`), and is excluded from `GET /events` for everyone else.

**Response `201`** — full event object (same shape as `GET /events/:id`), `creator` set from the JWT, `status: "open"`
**Errors:** `400` validation

---

### `PATCH /events/:id` 🔒
Only the creator may edit. Same partial-update pattern as `PATCH /users/me`.
**Errors:** `403` not the creator, `404` not found, `400` validation

---

### `DELETE /events/:id` 🔒
Only the creator may delete (or set `status: "cancelled"` instead of a hard delete — recommended so participants still see it).
**Response `204`** empty body
**Errors:** `403` not the creator, `404` not found

---

## Participation 🔒

### `POST /events/:id/join`
Adds the current user to the event's participant list.
**Response `200`**
```json
{ "eventId": "667a...", "status": "joined", "participantCount": 4 }
```
**Errors:**
- `404` event not found
- `409` already joined
- `409` event full — `{ "message": "Event is full" }`
- `409` event cancelled/in the past

---

### `DELETE /events/:id/join`
Leaves the event.
**Response `200`**
```json
{ "eventId": "667a...", "status": "left", "participantCount": 3 }
```
**Errors:** `404` not found or not currently joined

---

### `GET /users/me/events`
Convenience endpoint — events the current user created or joined.
**Query param:** `role` = `created` | `joined` | `all` (default `all`)
**Response `200`** — same array shape as `GET /events`

---

## Suggested build order (matches the contract top to bottom)

1. `POST /auth/signup`, `POST /auth/login` — unblocks everything else
2. `GET /users/me`, `PATCH /users/me`
3. `POST /events`, `GET /events`, `GET /events/:id`
4. `POST /events/:id/join`, `DELETE /events/:id/join`
5. `PATCH /events/:id`, `DELETE /events/:id`
6. `GET /users/me/events`, filters on `GET /events`

Build backend + frontend for each numbered step together before moving to the next —
don't let one person race ahead on endpoints the other hasn't built UI for yet.
