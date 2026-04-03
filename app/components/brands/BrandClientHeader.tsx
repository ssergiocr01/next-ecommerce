"use client"

import { Plus } from "lucide-react"

export function BrandClientHeader({ total, onAction }: { total: number, onAction: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Marcas ({total})</h1>
        <p className="text-slate-500 text-sm">Gestión de identidad y fabricantes.</p>
      </div>
      <button 
        onClick={onAction}
        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md font-semibold"
      >
        <Plus size={20} /> Nueva Marca
      </button>
    </div>
  )
}
