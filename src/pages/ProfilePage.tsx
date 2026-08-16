import React, { useEffect, useState } from "react";
import type { UpdateUserInput } from "../types/User";
import { useAuth } from "../context/AuthContext";
import DefaultAvatar from '../assets/img/default_userAvatar.png';
import { getEvents } from "../api/eventApi";
import type { Event } from "../types/Event";
import EventCard from "../components/EventCard";


export default function UpdateUser() {
const {user, updateUser } = useAuth(); //the real, current logged-in user

const [isEditing, setIsEditing ] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError ] =useState<string | null>(null);

const [form, setForm] = useState<UpdateUserInput>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    dateOfBirth: user?.dateOfBirth ?? '',
    gender: user?.gender ?? 'other',
    location: { 
        city: user?.location?.city ?? '', 
        country: user?.location?.country ?? '' },
    bio: user?.bio ?? '',
    profileImage: user?.profileImage,
    sports :  user?.sports ?? [],  
});

const [myEvents, setMyEvents ] = useState<Event[]>([]);
const [eventsLoading, setEventsLoading ] = useState(true);

useEffect(() => {
    (async () => {
        try {
            const result = await getEvents();
            setMyEvents(result.events);
        } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong :(");
    } finally {
        setEventsLoading(false);
    }
})();
}, []);

const createdEvents = myEvents.filter((e) => e.creator.id === user?.id);
const joinedEvents = myEvents.filter((e) => e.participants.some((p) => p.user.id === user?.id ));


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: 'city' | 'country' ; value: string };
    setForm((prev) => ({
        ...prev,
        location: {
         city: prev.location?.city ?? '',
         country: prev.location?.country ?? '',
         coordinates: prev.location?.coordinates,
           [name]: value,
        },
    }));
    };

const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
        await updateUser(form);
        setIsEditing(true);
    } catch (err) {
        setError(err instanceof Error ? err.message: 'Something went wrong :( ');
    } finally {
        setSaving(false);
    }
};

return( 
     <div className="min-h-screen bg-black text-white px-6 py-10 max-w-2xl mx-auto">
        {!isEditing ? (
            <div className="flex flex-col items-center gap-4">
                <img
                    src={user?.profileImage || DefaultAvatar}
                    alt={user?.username}
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-lime-400"
                />
                <h1 className="text-2xl font-bold">{user?.username}</h1>
                <p className="text-sm text-white/60">
                    {user?.firstName} {user?.lastName}
                </p>
                {user?.bio && <p className="text-center text-white/80 max-w-md">{user.bio}</p>}
                <p className="text-sm text-white/60">
                    {user?.location.city}, {user?.location.country}
                </p>

                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 rounded-lg bg-lime-400 text-black text-sm font-medium"
                >
                    Edit Profile
                </button>
            <div className="w-full mt-8">
    <h2 className="text-lg font-semibold mb-3">Events you created</h2>
    {eventsLoading ? (
        <p className="text-sm text-white/60">Loading events...</p>
    ) : createdEvents.length === 0 ? (
        <p className="text-sm text-white/60">You haven't created any events yet.</p>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {createdEvents.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    )}
</div>

<div className="w-full mt-8">
    <h2 className="text-lg font-semibold mb-3">Events you joined</h2>
    {eventsLoading ? (
        <p className="text-sm text-white/60">Loading events...</p>
    ) : joinedEvents.length === 0 ? (
        <p className="text-sm text-white/60">You haven't joined any events yet.</p>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {joinedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    )}
</div>
        
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold mb-2">Edit Profile</h1>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    name="bio"
                    value={form.bio ?? ""}
                    onChange={handleChange}
                    placeholder="Bio"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    name="profileImage"
                    value={form.profileImage ?? ""}
                    onChange={handleChange}
                    placeholder="Profile image URL"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    name="city"
                    value={form.location?.city ?? ""}
                    onChange={handleLocationChange}
                    placeholder="City"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    name="country"
                    value={form.location?.country ?? ""}
                    onChange={handleLocationChange}
                    placeholder="Country"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />

                <div className="flex gap-3 mt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-lime-400 text-black text-sm font-medium disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg border border-white/20 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        )}
    </div>
);
};