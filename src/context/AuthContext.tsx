import { createContext, useEffect, useState, useContext, type ReactNode } from "react";
import type { SignUpInput, LoginInput, User, UpdateUserInput } from "../types/User";
import { signup as apiSignup, login as apiLogin, logout as apiLogout, getMe, updateMe } from "../api/authApi";


interface AuthContextValue  {
    user: User | null;
    loading: boolean;
    login: (data: LoginInput) => Promise<void>;
    signup: (data: SignUpInput) => Promise<void>;
    logout: () => void;
    updateUser: (data: UpdateUserInput) => Promise<void>;

}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children } : { children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // true until we check /user/me

    useEffect(() => {
    // This effect runs once on mount to fetch the current user.
    // We track `alive` so we don't call setState after unmount.
        let alive = true;

        (async () => {
            try {
                const currentUser = await getMe();
            if (alive) {
                setUser(currentUser);
                localStorage.setItem('user', JSON.stringify(currentUser));
            }
        } catch {
            if (alive) {
                setUser(null);
                localStorage.removeItem('user');
            }
        } finally {
            if (alive) setLoading(false);
        }    
        })();
        return () => {
            alive = false;
        };

    }, []);

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

    const handleUpdateUser = async (data: UpdateUserInput) => {
        const updated = await updateMe(data);
        persistSession(updated);
    }

    const handleLogout = async () => {
        await apiLogout();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
    <AuthContext.Provider value={{user, loading, signup: handleSignUp, login: handleLogin, logout: handleLogout, updateUser: handleUpdateUser}}>
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
