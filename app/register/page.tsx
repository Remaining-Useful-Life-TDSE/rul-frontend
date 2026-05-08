import { RegisterPanel } from "./_components/RegisterPanel"
import { RegisterForm } from "./_components/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — fleet preview */}
      <div className="hidden lg:flex lg:w-[45%] flex-col bg-[#0b1120] border-r border-slate-800 relative overflow-hidden">
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-[350px] w-[350px] rounded-full bg-orange-500/6 blur-[100px]" />
          <div className="absolute bottom-10 right-0 h-[250px] w-[250px] rounded-full bg-indigo-500/5 blur-[80px]" />
        </div>
        <div className="relative flex-1">
          <RegisterPanel />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col bg-[#111827] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-orange-500/4 blur-[100px]" />
        </div>
        <div className="relative flex-1">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
