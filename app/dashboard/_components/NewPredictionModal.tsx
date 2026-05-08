"use client"

import { useState, useRef, useCallback } from "react"
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  parseCsv,
  useNewPrediction,
  SENSOR_FIELDS,
  SensorReading,
} from "../_hooks/useNewPrediction"

const COL_LABELS: Record<string, string> = {
  altitude: "Altitud",
  mach_number: "Mach",
  throttle_resolver_angle: "TRA",
  lpc_outlet_temperature: "T24 (°R)",
  hpc_outlet_temperature: "T30 (°R)",
  lpt_outlet_temperature: "T50 (°R)",
  hpc_outlet_pressure: "P30 (psia)",
  physical_fan_speed: "Nf (rpm)",
  physical_core_speed: "Nc (rpm)",
  hpc_outlet_static_pressure: "Ps30",
  fuel_flow_ratio_ps30: "Phi",
  corrected_fan_speed: "NRf",
  corrected_core_speed: "NRc",
  bypass_ratio: "BPR",
  bleed_enthalpy: "htBleed",
  hpc_cooling_air_flow: "W31",
  lpt_cooling_air_flow: "W32",
}

function getRulStatus(rul: number) {
  if (rul < 30) return "Crítico"
  if (rul < 100) return "Revisión Inmediata"
  if (rul < 200) return "Precaución"
  return "Saludable"
}

function getRulStatusStyle(rul: number) {
  if (rul < 30) return "border-red-500/30 bg-red-500/10 text-red-400"
  if (rul < 100) return "border-orange-500/30 bg-orange-500/10 text-orange-400"
  if (rul < 200) return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
}

function downloadTemplate() {
  const header = SENSOR_FIELDS.join(",")
  const emptyRows = Array.from({ length: 30 }, () =>
    SENSOR_FIELDS.map(() => "0").join(",")
  ).join("\n")
  const csv = header + "\n" + emptyRows
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "plantilla_sensores_30ciclos.csv"
  a.click()
  URL.revokeObjectURL(url)
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NewPredictionModal({ isOpen, onClose }: Props) {
  const { predict, isLoading, error: apiError } = useNewPrediction()

  const [engineId, setEngineId] = useState("")
  const [csvError, setCsvError] = useState<string | null>(null)
  const [parsedRows, setParsedRows] = useState<SensorReading[] | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showAllCols, setShowAllCols] = useState(false)
  const [resultRul, setResultRul] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    const isCsv =
      file.name.toLowerCase().endsWith(".csv") ||
      file.name.toLowerCase().endsWith(".txt") ||
      file.type === "text/csv" ||
      file.type === "text/plain"

    if (!isCsv) {
      setCsvError("El archivo debe ser .csv o .txt")
      setParsedRows(null)
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const result = parseCsv(text)
      setCsvError(result.error)
      setParsedRows(result.error ? null : result.rows)
    }
    reader.readAsText(file)
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  async function handleSubmit() {
    if (!parsedRows || !engineId.trim()) return
    const result = await predict(engineId.trim(), parsedRows)
    if (result) {
      setResultRul(result.predicted_rul)
    }
  }

  function handleClose() {
    setEngineId("")
    setCsvError(null)
    setParsedRows(null)
    setFileName(null)
    setResultRul(null)
    setShowAllCols(false)
    onClose()
  }

  if (!isOpen) return null

  const previewFields = showAllCols
    ? [...SENSOR_FIELDS]
    : [...SENSOR_FIELDS].slice(0, 6)

  const canSubmit = !!parsedRows && engineId.trim().length > 0 && !isLoading

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0b1120] shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Nueva Predicción de RUL</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Importá los últimos 30 ciclos de vuelo del motor
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {resultRul !== null ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10">
                <CheckCircle2 className="h-8 w-8 text-orange-400" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Motor · {engineId}
                </p>
                <p className="text-6xl font-bold text-white tabular-nums">
                  {Math.round(resultRul)}
                </p>
                <p className="text-sm text-slate-400 mt-1">ciclos de vida útil restantes (RUL)</p>
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-wider ${getRulStatusStyle(resultRul)}`}
                  >
                    {getRulStatus(resultRul)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg bg-orange-500 px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            /* ── Input state ── */
            <div className="flex flex-col gap-5">
              {/* Engine ID */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  ID del Motor
                </Label>
                <Input
                  placeholder="Ej: CFM56-7B-A1234"
                  value={engineId}
                  onChange={(e) => setEngineId(e.target.value)}
                  className="border-slate-700 bg-[#111827] text-slate-200 placeholder:text-slate-600 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/50"
                />
              </div>

              {/* Upload zone */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Datos de Sensores (CSV / TXT)
                  </Label>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Descargar plantilla
                  </button>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={[
                    "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-8 transition-colors",
                    isDragging
                      ? "border-orange-500/60 bg-orange-500/5"
                      : parsedRows
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-slate-700 bg-[#111827] hover:border-slate-600",
                  ].join(" ")}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {parsedRows ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-emerald-400">{fileName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          30 ciclos · 17 sensores — listo para predecir
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-[#0b1120]">
                        {isDragging ? (
                          <FileText className="h-5 w-5 text-orange-400" />
                        ) : (
                          <Upload className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-300">
                          Arrastrá el archivo o hacé click para seleccionar
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          CSV o TXT · 30 filas · 17 columnas · separador auto-detectado
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {csvError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-400">{csvError}</p>
                  </div>
                )}
              </div>

              {/* Preview table */}
              {parsedRows && parsedRows.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Vista previa — primeros 5 ciclos de 30
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-[#111827]">
                          <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                            Ciclo
                          </th>
                          {previewFields.map((f) => (
                            <th
                              key={f}
                              className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap"
                            >
                              {COL_LABELS[f]}
                            </th>
                          ))}
                          {!showAllCols && (
                            <th className="px-3 py-2 text-[10px] text-slate-700">
                              +11 más
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.slice(0, 5).map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-slate-800/60 hover:bg-slate-800/20"
                          >
                            <td className="px-3 py-1.5 font-mono text-slate-500">
                              {i + 1}
                            </td>
                            {previewFields.map((f) => (
                              <td
                                key={f}
                                className="px-3 py-1.5 font-mono text-slate-300 whitespace-nowrap"
                              >
                                {row[f].toFixed(2)}
                              </td>
                            ))}
                            {!showAllCols && (
                              <td className="px-3 py-1.5 text-slate-700">…</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={() => setShowAllCols((v) => !v)}
                    className="flex items-center gap-1 self-start text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${showAllCols ? "rotate-180" : ""}`}
                    />
                    {showAllCols ? "Mostrar menos columnas" : "Mostrar todas las columnas (17)"}
                  </button>
                </div>
              )}

              {/* API error */}
              {apiError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-400">{apiError}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  onClick={handleClose}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {isLoading ? "Prediciendo…" : "Predecir RUL"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
