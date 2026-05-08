"use client"

import { useEffect } from "react"
import { X, AlertTriangle, CheckCircle2, AlertOctagon, ShieldAlert, Clock, Cpu } from "lucide-react"
import { Prediction } from "../_hooks/usePredictions"

type Status = "SALUDABLE" | "PRECAUCIÓN" | "REVISIÓN INMEDIATA" | "CRÍTICO"

function getStatus(rul: number): Status {
  if (rul < 30)  return "CRÍTICO"
  if (rul < 100) return "REVISIÓN INMEDIATA"
  if (rul < 200) return "PRECAUCIÓN"
  return "SALUDABLE"
}

const STATUS_CONFIG: Record<Status, {
  icon: React.ElementType
  color: string
  border: string
  bg: string
  gaugeFg: string
  recommendation: string
  action: string
}> = {
  "SALUDABLE": {
    icon: CheckCircle2,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    gaugeFg: "#34d399",
    recommendation: "El motor opera dentro de los parámetros normales de vida útil.",
    action: "Mantener el plan de mantenimiento programado. Próxima evaluación en el ciclo regular.",
  },
  "PRECAUCIÓN": {
    icon: AlertTriangle,
    color: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    gaugeFg: "#facc15",
    recommendation: "El motor muestra desgaste acumulado que requiere seguimiento.",
    action: "Programar una inspección técnica en los próximos 30 ciclos de vuelo.",
  },
  "REVISIÓN INMEDIATA": {
    icon: ShieldAlert,
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    gaugeFg: "#fb923c",
    recommendation: "El motor se acerca al límite de vida útil estimado.",
    action: "Coordinar mantenimiento antes del próximo vuelo. Notificar al equipo técnico.",
  },
  "CRÍTICO": {
    icon: AlertOctagon,
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    gaugeFg: "#f87171",
    recommendation: "El motor superó el umbral de riesgo crítico de operación.",
    action: "Sacar el motor de servicio inmediatamente. Revisión completa obligatoria antes de operar.",
  },
}

function RulGauge({ rul, color }: { rul: number; color: string }) {
  const cap = 200
  const pct = Math.min(rul / cap, 1)
  const r = 54
  const circ = 2 * Math.PI * r
  const filled = pct * circ

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white tabular-nums leading-none">
          {Math.round(rul)}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">ciclos</span>
      </div>
    </div>
  )
}

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })
  } catch { return ts }
}

interface Props {
  prediction: Prediction | null
  onClose: () => void
}

export function PredictionDrawer({ prediction, onClose }: Props) {
  const isOpen = prediction !== null

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  const status = prediction ? getStatus(prediction.predicted_rul) : "SALUDABLE"
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer */}
      <div
        className={[
          "fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-[#080f1c] border-l border-slate-800 shadow-2xl",
          "flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold text-white">Detalle del Motor</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {prediction && (
          <div className="flex flex-col gap-6 overflow-y-auto p-5 flex-1">

            {/* Engine ID + timestamp */}
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ID del Motor</p>
              <p className="font-mono text-lg font-bold text-white">{prediction.engine_id}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="h-3 w-3 text-slate-600" />
                <p className="text-xs text-slate-500">{formatTimestamp(prediction.timestamp)}</p>
              </div>
            </div>

            {/* Gauge + RUL */}
            <div className="flex flex-col items-center gap-3 py-2">
              <RulGauge rul={prediction.predicted_rul} color={cfg.gaugeFg} />
              <p className="text-xs text-slate-500">Vida Útil Restante Estimada (RUL)</p>
            </div>

            {/* Status badge */}
            <div className={`flex items-center gap-3 rounded-xl border p-4 ${cfg.border} ${cfg.bg}`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${cfg.border} ${cfg.bg}`}>
                <Icon className={`h-5 w-5 ${cfg.color}`} />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${cfg.color}`}>{status}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{cfg.recommendation}</p>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Acción Recomendada
              </p>
              <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{cfg.action}</p>
              </div>
            </div>

            {/* RUL scale reference */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Escala de Referencia
              </p>
              <div className="flex flex-col gap-1.5">
                {(["SALUDABLE", "PRECAUCIÓN", "REVISIÓN INMEDIATA", "CRÍTICO"] as Status[]).map((s) => {
                  const c = STATUS_CONFIG[s]
                  const SI = c.icon
                  const isActive = s === status
                  return (
                    <div
                      key={s}
                      className={[
                        "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                        isActive ? `${c.bg} border ${c.border}` : "border border-transparent",
                      ].join(" ")}
                    >
                      <SI className={`h-3.5 w-3.5 shrink-0 ${isActive ? c.color : "text-slate-700"}`} />
                      <span className={`text-xs font-medium ${isActive ? c.color : "text-slate-600"}`}>{s}</span>
                      <span className="ml-auto text-[10px] text-slate-600">
                        {s === "SALUDABLE" && "≥ 200 ciclos"}
                        {s === "PRECAUCIÓN" && "100 – 199 ciclos"}
                        {s === "REVISIÓN INMEDIATA" && "30 – 99 ciclos"}
                        {s === "CRÍTICO" && "< 30 ciclos"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
