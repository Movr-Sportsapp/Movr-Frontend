const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${path}`;

    const token = localStorage.getItem('token');

    const res = await fetch(url,{
        ...options,
        headers: {
    'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
                },
        })
    

    if(!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || 'Request failed');
    }

    return res.json();
}