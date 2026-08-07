import { apiFetch } from "./fetchClient";
import type { SignUpInput, LoginInput, AuthResponse } from "../types/User";

export async function signup(data: SignUpInput) : Promise<AuthResponse> {
    return apiFetch('/auth/signup', {
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