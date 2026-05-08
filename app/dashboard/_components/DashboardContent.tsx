"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { usePredictions, Prediction } from "../_hooks/usePredictions"
import { FleetMetrics } from "./FleetMetrics"
import { PredictionsTable } from "./PredictionsTable"
import { PredictionDrawer } from "./PredictionDrawer"

export function DashboardContent() {
  const { predictions, isLoading, error } = usePredictions()
  const [selected, setSelected] = useState<Prediction | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vista General de la Flota</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitoreo predictivo de salud de motores turbofán.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200">
          <Download className="h-3.5 w-3.5" />
          Exportar Reporte
        </button>
      </div>

      <FleetMetrics predictions={predictions} isLoading={isLoading} />

      <PredictionsTable
        predictions={predictions}
        isLoading={isLoading}
        error={error}
        onSelect={setSelected}
      />

      <PredictionDrawer
        prediction={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
