import React, { useState } from "react";
import type { UpdateUserInput } from "../types/User";
import { useAuth } from "../context/AuthContext";


export default function UpdateUser() {
const {user } = useAuth(); //the real, current logged-in user

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
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
        ...prev,
        location: {
           ...prev.location,
           [e.target.name]: e.target.value,
        },
    }));
    };

return( 
    <div>
        <h1>Your Profile</h1>  
    </div>
)
};