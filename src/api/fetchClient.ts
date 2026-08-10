const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url,{
        ...options,
        credentials: 'include',
        headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                },
        })
    

    if(!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || 'Request failed');
    }

    return res.json();
}