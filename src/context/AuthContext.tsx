import { createContext, useState, useContext, type ReactNode } from "react";
import type { SignUpInput, LoginInput, User } from "../types/User";
import { signup as apiSignup, login as apiLogin, logout as apiLogout } from "../api/authApi";


interface AuthContextValue  {
    user: User | null;
    loading: boolean;
    login: (data: LoginInput) => Promise<void>;
    signup: (data: SignUpInput) => Promise<void>;
    logout: () => void;

}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children } : { children: ReactNode}) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem('user'); // if corrupted data, clear it
            return null;
        }
    }
    return null;
    });

    const [loading, setLoading] = useState(false); // not currently used — reserved for a future async check


    const persistSession = (nextUser: User) => {
        localStorage.setItem('user', JSON.stringify(nextUser));
        setUser(nextUser);
    };

    const handleSignUp = async (data: SignUpInput) => {
        const { user: signedInUser } = await apiSignup(data);
        persistSession(signedInUser);
    };

    const handleLogin = async (data: LoginInput) => {
        const { user: loggedInUser } = await apiLogin(data);
        persistSession(loggedInUser);
    };

    const handleLogout = async () => {
        await apiLogout();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
    <AuthContext.Provider value={{user, loading, signup: handleSignUp, login: handleLogin, logout: handleLogout}}>
        {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
   const context =  useContext(AuthContext);
   if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
}
