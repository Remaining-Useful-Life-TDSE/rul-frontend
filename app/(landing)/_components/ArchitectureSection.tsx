import { Layers, GitBranch } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Extracción CNN",
    description:
      "Redes Neuronales Convolucionales (CNN) procesan la señal de datos del motor identificando características locales e información de cada fragmento del movimiento.",
  },
  {
    icon: GitBranch,
    title: "Dependencias BiLSTM",
    description:
      "Capa Bidireccional Long Short-Term Memory captura dependencias temporales en ambas direcciones, usando el patrón de datos históricos de las secuencias anteriores.",
  },
]

export function ArchitectureSection() {
  return (
    <section id="arquitectura" className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-4">
            Arquitectura Híbrida Profunda
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Modelado predictivo utilizando extracción de características locales y
            dependencias temporales a largo plazo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-800 bg-[#111827] p-6 transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Icon className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
