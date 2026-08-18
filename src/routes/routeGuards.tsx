import type {ReactNode} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//Pages that require being LOGGED IN
export function RequireAuth({ children }: {children: ReactNode}) {
    const { user, loading } = useAuth();

    if(loading) {
        return null;
    }

    if(!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

//Pages that require user to be LOGGED OUT (e.g. /login, /signup)
export function RequireGuest({ children}: {children: ReactNode}) {
    const { user, loading } = useAuth();

    if(loading) {
        return null;
    }

    if(user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>
}