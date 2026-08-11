import React, { useState } from "react";
import type { SignUpInput } from "../types/User";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function SignUpPage() {

const [form, setForm] = useState<SignUpInput>({

    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "other",
    location: { city: "", country: ""},

});

const {signup } = useAuth();
const navigate = useNavigate();

const [loading, setLoading ] = useState(false);
const [error, setError] = useState<string | null>(null);

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

const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);


    if(!form.firstName || !form.lastName || !form.username || !form.password || !form.confirmPassword || !form.dateOfBirth || !form.gender || !form.email || !form.location.city || !form.location.country ) {
        setError("All fields are required!");
        return;
    }

    if(form.password !== form.confirmPassword) {
        setError("Passwords do not match!");
        return;
    }



    setLoading(true);
    try {
        await signup(form);
        navigate("/");
    } catch (err) {
        const message = err instanceof Error ? err.message: "Something went wrong";
        setError(message);
    } finally {
        setLoading(false);
    }
};

    return( 
    <div>
        <h1>Sign Up Page!</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstname"> Firstname
                <input 
                    id="firstname"
                    type='text'
                    name='firstName'
                    placeholder="Firstname"
                    value={form.firstName}
                    onChange={handleChange}
                /></label>
                 <label htmlFor="lastname"> Lastname
                <input 
                    id="lastname"
                    type='text'
                    name='lastName'
                    placeholder="Lastname"
                    value={form.lastName}
                    onChange={handleChange}
                /></label>
                 <label htmlFor="username"> Username
                <input 
                    id="username"
                    type='text'
                    name='username'
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                /></label>
                 <label htmlFor="email"> Email
                <input 
                    id="email"
                    type='email'
                    name='email'
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                /></label>
                 <label htmlFor="password"> Password
                <input 
                    id="password"
                    type='password'
                    name='password'
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                /></label>
                 <label htmlFor="confirmPassword"> Confirm password
                <input 
                    id="confirmPassword"
                    type='password'
                    name='confirmPassword'
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                /></label>
                 <label htmlFor="birthdate"> Date of birth
                <input 
                    id="birthdate"
                    type='date'
                    name='dateOfBirth'
                    max="2008-08-01"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                /></label>
                <fieldset>
                    Select your preferred gender
                    <label htmlFor="male"> male
                    <input 
                        id="male"
                        type='radio'
                        name='gender'
                        value='male'
                        checked={form.gender === 'male'}
                        onChange={handleChange}
                    /></label>
                    <label htmlFor="female"> female
                    <input 
                        id="female"
                        type='radio'
                        name='gender'
                        value='female'
                        checked={form.gender === 'female'}
                        onChange={handleChange}
                    /></label>
                    <label htmlFor="nonbinary"> non-binary
                    <input 
                        id="nonbinary"
                        type='radio'
                        name='gender'
                        value='non-binary'
                        checked={form.gender === 'non-binary'}
                        onChange={handleChange}
                    /></label>
                    <label htmlFor="other"> other
                    <input 
                        id="other"
                        type='radio'
                        name='gender'
                        value='other'
                        checked={form.gender === 'other'}
                        onChange={handleChange}
                    /></label>
                </fieldset>
                <label htmlFor="city"> City
                <input 
                    id="city"
                    type='text'
                    name='city'
                    placeholder="City"
                    value={form.location.city}
                    onChange={handleLocationChange}
                /></label>
                <label htmlFor="country"> Country
                <input 
                    id="country"
                    type='text'
                    name='country'
                    placeholder="Country"
                    value={form.location.country}
                    onChange={handleLocationChange}
                /></label>
            {error && <p style={{ color: 'red'}}>{error}</p>}

            <button className="w-full mt-2 py-3.5 rounded-xl bg-lime-500 text-bg font-bold text-sm tracking-wide hover:bg-lime/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                type='submit' 
                disabled={loading}>
                {loading ? 'loading...' : 'Create account'}
            </button>
            </form>
            <p className="mt-6 text-center text-sm text-muted"> Already have an account? </p>
            <button className="text-lime-500 hover:text-lime/80 font-medium transition-colors">
            <NavLink to="/login">Login</NavLink>
            </button>
    </div>
    )
};