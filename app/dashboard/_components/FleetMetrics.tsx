import { AlertTriangle, CheckCircle2, Cpu } from "lucide-react"
import { Prediction } from "../_hooks/usePredictions"

function CircularGauge({ pct }: { pct: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const filled = (pct / 100) * circ
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke="#f97316"
        strokeWidth="7"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

function latestPerEngine(predictions: Prediction[]): Prediction[] {
  const map = new Map<string, Prediction>()
  for (const p of predictions) {
    const existing = map.get(p.engine_id)
    if (!existing || new Date(p.timestamp) > new Date(existing.timestamp)) {
      map.set(p.engine_id, p)
    }
  }
  return [...map.values()]
}

interface Props {
  predictions: Prediction[]
  isLoading: boolean
}

export function FleetMetrics({ predictions, isLoading }: Props) {
  const latest = latestPerEngine(predictions)
  const total = latest.length
  const healthy = latest.filter((p) => p.predicted_rul >= 200).length
  const atRisk = latest.filter((p) => p.predicted_rul < 100).length
  const healthPct = total > 0 ? Math.round((healthy / total) * 100) : 0

  const skeleton = "animate-pulse bg-slate-800 rounded"

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Salud de la flota */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Salud Activa de la Flota
        </p>
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className={`h-20 w-20 rounded-full ${skeleton}`} />
            <div className="flex flex-col gap-2">
              <div className={`h-8 w-16 ${skeleton}`} />
              <div className={`h-3 w-28 ${skeleton}`} />
            </div>
          </div>
        ) : total === 0 ? (
          <div className="flex items-center gap-3">
            <Cpu className="h-8 w-8 text-slate-700" />
            <p className="text-sm text-slate-600">Sin datos aún</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <CircularGauge pct={healthPct} />
              <span className="absolute text-lg font-bold text-orange-400">{healthPct}%</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-white leading-none">{total}</p>
              <p className="mt-1 text-xs text-slate-500">
                Motor{total !== 1 ? "es" : ""} monitoreado{total !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* En riesgo */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Requieren Atención
        </p>
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full ${skeleton}`} />
            <div className="flex flex-col gap-2">
              <div className={`h-8 w-12 ${skeleton}`} />
              <div className={`h-3 w-28 ${skeleton}`} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10">
              <AlertTriangle className="h-7 w-7 text-yellow-400" />
            </div>
            <div>
              {total > 0 && (
                <p className="text-sm font-semibold text-yellow-400">
                  {total > 0 ? Math.round((atRisk / total) * 100) : 0}%
                </p>
              )}
              <p className="text-3xl font-bold text-white leading-none">{atRisk}</p>
              <p className="mt-1 text-xs text-slate-500">
                {atRisk === 1 ? "Motor en riesgo" : "Motores en riesgo"} (RUL &lt; 100)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Predicciones totales */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Predicciones Realizadas
        </p>
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full ${skeleton}`} />
            <div className="flex flex-col gap-2">
              <div className={`h-8 w-12 ${skeleton}`} />
              <div className={`h-3 w-24 ${skeleton}`} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white leading-none">{predictions.length}</p>
              <p className="mt-1 text-xs text-slate-500">
                Total histórico
              </p>
              {total > 0 && (
                <p className="text-xs text-slate-600 mt-0.5">
                  {total} motor{total !== 1 ? "es" : ""} único{total !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
