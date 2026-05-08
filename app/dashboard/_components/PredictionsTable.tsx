"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, SlidersHorizontal, ChevronLeft } from "lucide-react"
import { Prediction } from "../_hooks/usePredictions"

type Status = "SALUDABLE" | "PRECAUCIÓN" | "CRÍTICO" | "REVISIÓN INMEDIATA"

const statusStyles: Record<Status, string> = {
  "SALUDABLE":          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  "PRECAUCIÓN":         "border-yellow-500/30  bg-yellow-500/10  text-yellow-400",
  "CRÍTICO":            "border-red-500/30     bg-red-500/10     text-red-400",
  "REVISIÓN INMEDIATA": "border-orange-500/30  bg-orange-500/10  text-orange-400",
}

function getStatus(rul: number): Status {
  if (rul < 30)  return "CRÍTICO"
  if (rul < 100) return "REVISIÓN INMEDIATA"
  if (rul < 200) return "PRECAUCIÓN"
  return "SALUDABLE"
}

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
  } catch { return ts }
}

const PAGE_SIZE = 10

interface Props {
  predictions: Prediction[]
  isLoading: boolean
  error: string | null
  onSelect: (p: Prediction) => void
}

export function PredictionsTable({ predictions, isLoading, error, onSelect }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-white">Predicciones Registradas</h2>
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-14">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-orange-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-14">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : predictions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-2">
          <p className="text-sm text-slate-400">Sin predicciones registradas.</p>
          <p className="text-xs text-slate-600">
            Usá "Nueva Predicción" en el panel lateral para comenzar.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                {["Motor ID", "Fecha Predicción", "RUL Estimada (Ciclos)", "Estado de Alerta", "Detalle"].map((h) => (
                  <TableHead key={h} className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.slice(0, PAGE_SIZE).map((row) => {
                const status = getStatus(row.predicted_rul)
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => onSelect(row)}
                    className="border-slate-800 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-mono text-sm font-medium text-slate-200">
                      {row.engine_id}
                    </TableCell>
                    <TableCell className="text-sm text-slate-400">
                      {formatTimestamp(row.timestamp)}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-white">
                      {Math.round(row.predicted_rul)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:text-orange-400 transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
            <p className="text-xs text-slate-500">
              {predictions.length} predicción{predictions.length !== 1 ? "es" : ""} en total
            </p>
            <div className="flex items-center gap-1">
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
