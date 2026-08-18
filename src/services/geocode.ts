/**
 * Converts a free-text address into coordinates using OpenStreetMap's
 * Nominatim service (https://nominatim.org) — free, no API key required.
 *
 * Since Nominatim needs no key, calling it directly from the frontend is
 * safe (nothing secret to leak in the bundle), unlike Google/Mapbox where
 * the key would need to sit behind your own backend. That's why this talks
 * to Nominatim directly rather than going through a /geocode backend route.
 *
 * Usage note: Nominatim's usage policy caps free requests at roughly
 * 1/second and asks for a distinguishing app identifier — fine for
 * dev/demo traffic, but revisit (self-hosted Nominatim, caching, or a
 * paid provider) before this sees real production load.
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  /** The formatted address Nominatim resolved to — may differ slightly from user input. */
  formattedAddress: string;
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodeResult | null> {
  const trimmed = address.trim();
  if (!trimmed) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    trimmed,
  )}`;

  const response = await fetch(url, {
    headers: {
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`);
  }

  const results: Array<{ lat: string; lon: string; display_name: string }> =
    await response.json();
  if (results.length === 0) return null;

  const first = results[0];
  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    formattedAddress: first.display_name,
  };
}
