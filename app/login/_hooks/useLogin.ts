"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE } from "@/lib/api"
import { saveAuth } from "@/lib/auth"

export interface LoginFields {
  email: string
  password: string
}

export function useLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(fields: LoginFields) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message.join(", ") : (data.message ?? "Error al iniciar sesión")
        )
      }
      saveAuth(data.token, { email: data.email, name: data.name })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciales inválidas. Verifica tu email y contraseña.")
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
