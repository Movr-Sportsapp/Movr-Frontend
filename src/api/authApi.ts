import { apiFetch } from "./fetchClient";
import type { SignUpInput, LoginInput, AuthResponse, User } from "../types/User";

export async function signup(data: SignUpInput) : Promise<AuthResponse> {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

export async function login(data: LoginInput) : Promise<AuthResponse> {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

export async function logout(): Promise<void> {
    return apiFetch('/auth/logout', {method: 'DELETE'});
};

export async function getMe(): Promise<User> {
    return apiFetch('/user/me')
};