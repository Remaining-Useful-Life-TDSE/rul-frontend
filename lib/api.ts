import { getToken } from "./auth"

export const AUTH_BASE =
  process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001"

export const ENGINE_BASE =
  process.env.NEXT_PUBLIC_ENGINE_URL ?? "http://localhost:8000"

export function authHeaders(): HeadersInit {
  const base: Record<string, string> = { "Content-Type": "application/json" }
  const token = getToken()
  if (token) base["Authorization"] = `Bearer ${token}`
  return base
}
