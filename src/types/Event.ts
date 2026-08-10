
export type Event = {
    id: string;
    title: string;
    description: string | null ;
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
    skilllevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional' | null;
    maxParticipants: number;
    participants?: {
        user: string;
        joinedAt: string;
    };
    status: 'active' | 'cancelled' | 'completed' | null;
    public: boolean;
    womenOnly: boolean;
    flintaOnly: boolean;
};

