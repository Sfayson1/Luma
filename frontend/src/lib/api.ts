interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // other VITE_… variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API = import.meta.env.VITE_API_URL;

if (!API) {
  throw new Error("Missing VITE_API_URL environment variable");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  // 204 No Content (delete endpoints etc.)
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}
