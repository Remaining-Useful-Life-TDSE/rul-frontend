"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Rocket,
  LayoutDashboard,
  LogOut,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearAuth } from "@/lib/auth"
import { NewPredictionModal } from "./NewPredictionModal"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Panel" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  function handleLogout() {
    clearAuth()
    router.push("/login")
  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-800 bg-[#080f1c]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-4">
        <Rocket className="h-5 w-5 text-orange-500" />
        <div>
          <p className="text-sm font-bold text-white leading-none">AeroPredict</p>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">Inteligencia de Flota</p>
        </div>
      </div>

      {/* Nueva Predicción */}
      <div className="px-4 py-4">
        <button
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva Predicción
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-orange-500/10 text-orange-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-orange-400" : "text-slate-500")} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="flex flex-col gap-0.5 border-t border-slate-800 px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-800/60 hover:text-slate-300 w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>

      <NewPredictionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </aside>
  )
}
