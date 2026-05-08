"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegister } from "../_hooks/useRegister"

export function RegisterForm() {
  const { register, isLoading, error } = useRegister()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    register({ name, email, password, confirmPassword })
  }

  const inputClass =
    "border-slate-700 bg-[#0f172a] text-slate-200 placeholder:text-slate-600 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50"

  return (
    <div className="flex h-full flex-col justify-center px-10 py-16">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Crear Cuenta</h1>
        <p className="text-sm text-slate-500 mb-8">
          Únete a AeroPredict para acceder al centro de comando.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Nombre Completo
            </Label>
            <Input
              placeholder="Ingeniero / Analista"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Email Corporativo
            </Label>
            <Input
              type="email"
              placeholder="nombre@aerolínea.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-600">
              Mínimo 8 caracteres, números y símbolos.
            </p>
          </div>

          {/* Confirmar contraseña */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Registrar Credenciales
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          ¿Ya tienes acceso al sistema?{" "}
          <Link href="/login" className="text-orange-400 hover:text-orange-300 transition-colors">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
