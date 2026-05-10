import { getToken } from "./auth"

// Single entry point: all traffic goes through the Kong API gateway.
// In local dev: Kong proxy is bound to host port 8080.
// In production (Vercel): set NEXT_PUBLIC_API_URL to the public gateway URL.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export function authHeaders(): HeadersInit {
  const base: Record<string, string> = { "Content-Type": "application/json" }
  const token = getToken()
  if (token) base["Authorization"] = `Bearer ${token}`
  return base
}
