const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("Missing VITE_API_URL");
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) {
    return null as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.detail || `Request failed: ${res.status}`);
  }

  return data as T;
}
