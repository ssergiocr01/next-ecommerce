"use client"
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <AlertCircle size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-900">Algo salió mal</h2>
      <p className="text-slate-500 mb-6">{error.message || "Error interno del servidor"}</p>
      <button 
        onClick={() => reset()}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto"
      >
        <RefreshCcw size={18} /> Intentar de nuevo
      </button>
    </div>
  );
}
