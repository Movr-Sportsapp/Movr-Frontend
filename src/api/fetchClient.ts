const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path: string, options: RequestInit = {}, raw = false) {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url,{
        ...options,
        credentials: 'include',
        headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                },
        });

    const body = await res.json();
    
    if(!res.ok) {
    
        throw new Error(body.message || body. error || 'Request failed');
    }

    return raw ? body : (body.data ?? body);  // unwrap { data: ... } if present, otherwise return as-is


};