"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AUTH_BASE } from "@/lib/api"
import { saveAuth } from "@/lib/auth"

export interface RegisterFields {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function useRegister() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function register(fields: RegisterFields) {
    if (fields.password !== fields.confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${AUTH_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          password: fields.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message.join(", ") : (data.message ?? "Error al registrar")
        )
      }
      saveAuth(data.token, { email: data.email, name: data.name })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}
