/**
 * Central source of truth for all sport metadata (name, emoji, color, image, category).
 *
 * NOTE: This defines `SportName` — a string-literal union of sport names used for
 * display/lookup purposes (icons, colors, images). This is intentionally separate
 * from the `Sport` interface in `types/Sport.ts`, which represents the full sport
 * OBJECT returned by the backend (id, name, category, icon). Keep both:
 *   - `Sport` (types/Sport.ts)   -> shape of a sport as it comes from the API/DB
 *   - `SportName` (this file)    -> the fixed set of names we know how to render
 *
 * If the backend adds a sport that isn't in SPORTS yet, getters below fall back
 * to sane defaults instead of crashing or rendering `undefined`.
 */

export const SPORTS = [
  'Running',
  'Cycling',
  'Swimming',
  'Climbing',
  'Football',
  'Basketball',
  'Tennis',
  'Yoga',
  'Hiking',
  'Volleyball',
  'Badminton',
  'CrossFit',
  'Rollerskating',
] as const;

export type SportName = (typeof SPORTS)[number];

export interface SportMeta {
  emoji: string;
  color: string;
  /** Stock/placeholder image. Optional: falls back to DEFAULT_SPORT_IMAGE if omitted. */
  image?: string;
  category: 'Indoor' | 'Outdoor';
}

export const SPORT_CATALOG: Record<SportName, SportMeta> = {
  Running: {
    emoji: '🏃',
    color: '#C8FA5F',
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
  Cycling: {
    emoji: '🚴',
    color: '#60A5FA',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
  Swimming: {
    emoji: '🏊',
    color: '#22D3EE',
    image:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=500&fit=crop&auto=format',
    category: 'Indoor',
  },
  Climbing: {
    emoji: '🧗',
    color: '#FB923C',
    image:
      'https://images.unsplash.com/photo-1630431155308-bbf2daf27b00?w=800&h=500&fit=crop&auto=format',
    category: 'Indoor',
  },
  Football: {
    emoji: '⚽',
    color: '#4ADE80',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
  Basketball: {
    emoji: '🏀',
    color: '#FCD34D',
    image:
      'https://images.unsplash.com/photo-1590227632180-80a3bf110871?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
  Tennis: {
    emoji: '🎾',
    color: '#A3E635',
    image:
      'https://images.unsplash.com/photo-1668507911709-0249e832618d?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
  Yoga: {
    emoji: '🧘',
    color: '#C084FC',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop&auto=format',
    category: 'Indoor',
  },
  Hiking: {
    emoji: '🥾',
    color: '#F59E0B',
    image:
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
  Volleyball: {
    emoji: '🏐',
    color: '#F97316',
    image:
      'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
  Badminton: {
    emoji: '🏸',
    color: '#2DD4BF',
    // TODO: swap for a real badminton photo — currently reusing the tennis shot as a placeholder
    image:
      'https://images.unsplash.com/photo-1733141731875-8e33d5f2bd36?w=800&h=500&fit=crop&auto=format',
    category: 'Indoor',
  },
  CrossFit: {
    emoji: '💪',
    color: '#F87171',
    image:
      'https://images.unsplash.com/photo-1590333748338-d629e4564ad9?w=800&h=500&fit=crop&auto=format',
    category: 'Indoor',
  },
  Rollerskating: {
    emoji: '🛼',
    color: '#F472B6',
    image: 
    'https://images.unsplash.com/photo-1623091034795-46701649f6e9?w=800&h=500&fit=crop&auto=format',
    category: 'Outdoor',
  },
};

// --- Defaults / fallback for unknown or unmapped sports ---------------------

export const DEFAULT_SPORT_EMOJI = '🏅';
export const DEFAULT_SPORT_COLOR = '#94A3B8'; // neutral slate, matches a "TBD" badge look
export const DEFAULT_SPORT_IMAGE =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=500&fit=crop&auto=format';
export const DEFAULT_SPORT_CATEGORY: SportMeta['category'] = 'Outdoor';

// --- Derived flat lookups (in case some call sites prefer these directly) ---

export const SPORT_EMOJI: Record<SportName, string> = Object.fromEntries(
  SPORTS.map((s) => [s, SPORT_CATALOG[s].emoji])
) as Record<SportName, string>;

export const SPORT_COLOR: Record<SportName, string> = Object.fromEntries(
  SPORTS.map((s) => [s, SPORT_CATALOG[s].color])
) as Record<SportName, string>;

export const SPORT_IMAGES: Partial<Record<SportName, string>> = Object.fromEntries(
  SPORTS.filter((s) => SPORT_CATALOG[s].image).map((s) => [s, SPORT_CATALOG[s].image])
);

// --- Type guard ---------------------------------------------------------

export function isKnownSport(name: string): name is SportName {
  return (SPORTS as readonly string[]).includes(name);
}

// --- Getters (always use these at call sites instead of raw object access) --
// They accept `string` (not just SportName) because data coming from the
// backend is typed as `string` until validated — this keeps call sites simple
// and crash-proof if the backend sport list drifts from this file.

export function getSportMeta(name: string): SportMeta {
  if (isKnownSport(name)) return SPORT_CATALOG[name];
  return {
    emoji: DEFAULT_SPORT_EMOJI,
    color: DEFAULT_SPORT_COLOR,
    image: DEFAULT_SPORT_IMAGE,
    category: DEFAULT_SPORT_CATEGORY,
  };
}

export function getSportEmoji(name: string): string {
  return getSportMeta(name).emoji;
}

export function getSportColor(name: string): string {
  return getSportMeta(name).color;
}

export function getSportImage(name: string): string {
  return getSportMeta(name).image ?? DEFAULT_SPORT_IMAGE;
}

export function getSportCategory(name: string): SportMeta['category'] {
  return getSportMeta(name).category;
}