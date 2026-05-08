"use client"

import { useState } from "react"
import Link from "next/link"
import { Rocket, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLogin } from "../_hooks/useLogin"

export function LoginForm() {
  const { login, isLoading, error } = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1120] px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <Rocket className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">AeroPredict</h1>
            <p className="mt-1 text-sm text-slate-500">Autenticación · Inteligencia de Flota</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-7 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Correo Electrónico
              </label>
              <Input
                type="email"
                placeholder="analista@aerolinea.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-700 bg-[#0f172a] text-slate-200 placeholder:text-slate-600 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/50"
              />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Contraseña
                </label>
                <Link
                  href="#"
                  className="text-[11px] text-orange-400 transition-colors hover:text-orange-300"
                >
                  Recuperar
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-slate-700 bg-[#0f172a] pr-10 text-slate-200 placeholder:text-slate-600 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Acceder al Sistema
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          ¿Sin cuenta?{" "}
          <Link href="/register" className="text-orange-400 transition-colors hover:text-orange-300">
            Solicitar acceso
          </Link>
        </p>

        <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-slate-700">
          © 2026 AeroPredict · Enlace Cifrado
        </p>
      </div>
    </div>
  )
}
