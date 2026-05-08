"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"

export function TopBar() {
  const [initials, setInitials] = useState<string>("?")
  const [name, setName] = useState<string>("")

  useEffect(() => {
    const user = getUser()
    if (user?.name) {
      setName(user.name)
      setInitials(
        user.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      )
    }
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-slate-800 bg-[#080f1c] px-6">
      {name && (
        <span className="text-xs text-slate-500 hidden sm:block">{name}</span>
      )}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-md shadow-orange-500/20 select-none">
        {initials}
      </div>
    </header>
  )
}
