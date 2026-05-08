import { Rocket } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#080e1a] py-8 px-6">
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold text-slate-300">AeroPredict</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-500">Fleet Intelligence Dashboard</span>
        </div>
        <p className="text-xs text-slate-600">
          © 2026 AeroPredict — Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}
