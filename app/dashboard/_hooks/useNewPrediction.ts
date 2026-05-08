"use client"

import { useState } from "react"
import { ENGINE_BASE, authHeaders } from "@/lib/api"

export const SENSOR_FIELDS = [
  "altitude",
  "mach_number",
  "throttle_resolver_angle",
  "lpc_outlet_temperature",
  "hpc_outlet_temperature",
  "lpt_outlet_temperature",
  "hpc_outlet_pressure",
  "physical_fan_speed",
  "physical_core_speed",
  "hpc_outlet_static_pressure",
  "fuel_flow_ratio_ps30",
  "corrected_fan_speed",
  "corrected_core_speed",
  "bypass_ratio",
  "bleed_enthalpy",
  "hpc_cooling_air_flow",
  "lpt_cooling_air_flow",
] as const

type SensorField = (typeof SENSOR_FIELDS)[number]
export type SensorReading = Record<SensorField, number>

interface PredictionResult {
  id: string
  engine_id: string
  predicted_rul: number
  timestamp: string
}

interface ParsedCsvResult {
  rows: SensorReading[]
  error: string | null
}

function detectDelimiter(line: string): RegExp {
  if (line.includes(",")) return /,/
  if (line.includes("\t")) return /\t/
  return /\s+/
}

export function parseCsv(text: string): ParsedCsvResult {
  const lines = text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) {
    return { rows: [], error: "El archivo está vacío." }
  }

  const delimiter = detectDelimiter(lines[0])

  // Skip header row if first cell is non-numeric
  const firstCells = lines[0].split(delimiter).map((c) => c.trim())
  const isHeader = firstCells.some((c) => isNaN(Number(c)) && c !== "")
  const dataLines = isHeader ? lines.slice(1) : lines

  if (dataLines.length !== 30) {
    return {
      rows: [],
      error: `El CSV debe tener exactamente 30 filas de datos. Se encontraron ${dataLines.length}.`,
    }
  }

  const rows: SensorReading[] = []

  for (let i = 0; i < dataLines.length; i++) {
    const cells = dataLines[i].split(delimiter).map((c) => c.trim()).filter((c) => c !== "")

    if (cells.length !== 17) {
      return {
        rows: [],
        error: `Fila ${i + 1}: se esperaban 17 columnas, se encontraron ${cells.length}.`,
      }
    }

    const values = cells.map(Number)
    const badIdx = values.findIndex(isNaN)
    if (badIdx !== -1) {
      return {
        rows: [],
        error: `Fila ${i + 1}, columna ${badIdx + 1}: el valor "${cells[badIdx]}" no es numérico.`,
      }
    }

    const reading = {} as SensorReading
    SENSOR_FIELDS.forEach((field, idx) => {
      reading[field] = values[idx]
    })
    rows.push(reading)
  }

  return { rows, error: null }
}

export function useNewPrediction() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function predict(engineId: string, sequence: SensorReading[]): Promise<PredictionResult | null> {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${ENGINE_BASE}/predict`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ engine_id: engineId, sequence }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.detail
          ? typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
          : "Error al predecir"
        throw new Error(msg)
      }
      window.dispatchEvent(new Event("prediction-created"))
      return data as PredictionResult
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al conectar con el servidor.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { predict, isLoading, error }
}
