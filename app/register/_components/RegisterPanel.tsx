import { Rocket } from "lucide-react"

export function RegisterPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-10 py-12">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 shadow-lg shadow-orange-500/10">
          <Rocket className="h-8 w-8 text-orange-500" />
        </div>

        {/* Name */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">AeroPredict</h1>
          <p className="mt-1 text-sm font-medium text-orange-400 uppercase tracking-widest">
            Fleet Intelligence
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-16 bg-orange-500/30" />

        {/* Tagline */}
        <p className="max-w-xs text-sm text-slate-500 leading-relaxed">
          Predicción de Vida Útil en Motores de Avión mediante arquitectura CNN-BiLSTM
          entrenada sobre el dataset NASA C-MAPSS.
        </p>
      </div>
    </div>
  )
}
