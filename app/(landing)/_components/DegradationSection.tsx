import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Database, Layers, Gauge } from "lucide-react"

const phases = [
  {
    label: "Saludable",
    range: "RUL > 75%",
    bar: "w-full",
    color: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    label: "Advertencia",
    range: "RUL 40 – 75%",
    bar: "w-3/4",
    color: "bg-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
  {
    label: "Crítico",
    range: "RUL 10 – 40%",
    bar: "w-2/5",
    color: "bg-orange-500",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  },
  {
    label: "Falla Inminente",
    range: "RUL < 10%",
    bar: "w-[12%]",
    color: "bg-red-500",
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
  },
]

const metrics = [
  { icon: Gauge, label: "RMSE", value: "11.8", unit: "ciclos" },
  { icon: Activity, label: "MAE", value: "8.4", unit: "ciclos" },
  { icon: Layers, label: "Sensores", value: "21", unit: "features" },
  { icon: Database, label: "Ventana", value: "30", unit: "ciclos" },
]

export function DegradationSection() {
  return (
    <section className="py-20 px-6 bg-[#080e1a]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-bold text-orange-400 mb-6">Degradación No Lineal</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              El ciclo de vida de los motores turbofán presenta patrones de degradación
              altamente complejos y no lineales que pueden ir desde ciclos estables
              hasta ciclos completamente deteriorados, con múltiples componentes críticos
              del motor afectados.
            </p>
            <p className="text-slate-500 leading-relaxed text-sm">
              Nuestro sistema ingresa y procesa flujos de datos multivariados provenientes
              de los 21 sensores del motor a través de 30 ventanas de alta frecuencia
              distribuidas en los componentes críticos del motor.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Card className="border-slate-800 bg-[#111827]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Fases de Vida del Motor
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {phases.map(({ label, range, bar, color, badge }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">{label}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wider ${badge}`}
                      >
                        {range}
                      </Badge>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800">
                      <div className={`h-full rounded-full ${bar} ${color} transition-all`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {metrics.map(({ icon: Icon, label, value, unit }) => (
                <Card
                  key={label}
                  className="border-slate-800 bg-[#111827] text-center"
                >
                  <CardContent className="flex flex-col items-center gap-1 pt-4 pb-3">
                    <Icon className="h-4 w-4 text-orange-500 mb-1" />
                    <p className="text-xl font-bold text-white">{value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {label}
                    </p>
                    <p className="text-[10px] text-slate-600">{unit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
