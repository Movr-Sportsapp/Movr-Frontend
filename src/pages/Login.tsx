import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginInput } from '../types/User';


export default function LoginPage() {

const [form, setForm] = useState<LoginInput>({

    identifier: "",
    password: "",
});

const { login } = useAuth();
const navigate = useNavigate();

const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));

const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
        if(!form.identifier) {
            setError("Email or username required for login")
            return;
        }

        if(!form.password) {
            setError("Password is required")
            return;
        }

        setLoading(true);

        try {
            await login(form);
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
            <h1>Login Page!</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='identifier'> Email or username
                    <input 
                        id='identifier'
                        type='text'
                        name='identifier'
                        placeholder='Email or username'
                        value={form.identifier}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor='password'> Password
                    <input 
                        id='password'
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={form.password}
                        onChange={handleChange}
                    />
                </label>
                {error && <p style={{ color: 'red'}}>{error}</p>}

            <button type='submit' disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            </form>
        </div>
    )
    
}