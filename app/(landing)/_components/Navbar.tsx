import Link from "next/link"
import { Rocket } from "lucide-react"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-[#0b1120]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Rocket className="h-5 w-5 text-orange-500" />
          <span className="text-white font-semibold text-lg tracking-tight">AeroPredict</span>
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-400">
            Última Práctica
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-md"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  )
}
