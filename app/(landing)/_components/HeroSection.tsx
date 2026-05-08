import Link from "next/link"
import { BookOpen } from "lucide-react"

function EngineStatusCard() {
  const bars = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="rounded-xl border border-slate-700/60 bg-[#111827] p-5 shadow-2xl shadow-black/50 w-full">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold text-slate-200 tracking-wide">Estado del Motor</span>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Monitoreando
          </span>
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-slate-800 bg-[#0f172a] px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
          ID del Motor
        </p>
        <p className="text-sm font-mono text-slate-200">ENG-9011-FD001</p>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
          <span>Vida Útil Restante</span>
          <span className="text-orange-400">8.3%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800">
          <div className="h-full w-[8%] rounded-full bg-orange-500" />
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-slate-800 bg-[#0f172a] px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Progreso del Ciclo de Vida
        </p>
        <div className="flex gap-0.5">
          {bars.map((i) => (
            <div
              key={i}
              className={`h-4 flex-1 rounded-sm ${
                i < 18 ? "bg-orange-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
            Estado
          </p>
          <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
            Crítico
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-orange-500 px-3.5 py-2.5 text-center shadow-lg shadow-orange-500/30">
            <p className="text-3xl font-bold text-white leading-none">21</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Ciclos</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Restantes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-6">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/8 blur-[120px]" />
        <div className="absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-indigo-500/6 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-sky-500/5 blur-[80px]" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Transformación Digital:{" "}
              <span className="text-orange-400">
                Predicción de Vida Útil en Motores de Avión
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Arquitectura profunda para la estimación de RUL (Remaining Useful Life)
              basada en el dataset NASA C-MAPSS.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
              >
                Consultar Análisis
              </Link>
              <Link
                href="#arquitectura"
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Ver Documentación
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <EngineStatusCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

