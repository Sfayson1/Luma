import { apiFetch } from "./api";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export async function login(email: string, password: string) {
  // If your FastAPI login expects JSON, this is correct:
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("access_token", data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
}

export async function me() {
  return apiFetch("/api/auth/me");
}
