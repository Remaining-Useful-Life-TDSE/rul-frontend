import { getToken } from "./auth"

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

function baseHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  }
}

export function apiHeaders(): HeadersInit {
  return baseHeaders()
}

export function authHeaders(): HeadersInit {
  const headers = baseHeaders()
  const token = getToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}
