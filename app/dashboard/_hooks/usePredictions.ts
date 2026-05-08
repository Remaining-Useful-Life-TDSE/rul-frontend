"use client"

import { useState, useEffect, useCallback } from "react"
import { ENGINE_BASE, authHeaders } from "@/lib/api"

export interface Prediction {
  id: string
  engine_id: string
  predicted_rul: number
  timestamp: string
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPredictions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${ENGINE_BASE}/predictions`, {
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error("Error al cargar predicciones")
      const data = await res.json()
      // API returns { count, predictions }; sort newest first
      const sorted = [...(data.predictions as Prediction[])].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setPredictions(sorted)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPredictions()
    const handler = () => fetchPredictions()
    window.addEventListener("prediction-created", handler)
    return () => window.removeEventListener("prediction-created", handler)
  }, [fetchPredictions])

  return { predictions, isLoading, error }
}
