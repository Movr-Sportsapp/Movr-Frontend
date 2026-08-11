
export type Event = {
    id: string;
    title: string;
    description: string;
    sport: string;
    creator: string;
    location: {
    city: string;
    coordinates?: {
        latitude: number;
        longitude: number;
        };
    };
    date: string;
    skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional' ;
    maxParticipants: number;
    participants: {
        user: string;
        joinedAt: string;
    }[];
    status: 'active' | 'cancelled' | 'completed' ;
    public: boolean;
    womenOnly: boolean;
    flintaOnly: boolean;
};

export type EventsQuery = {
    sport?: string;
    city?: string;
    skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
    status?: 'active' | 'cancelled' | 'completed';
    date?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
}