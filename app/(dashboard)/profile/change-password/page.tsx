"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/auth";
import { KeyRound, ShieldCheck, AlertCircle, Loader2, Save } from "lucide-react";

export default function ChangePasswordPage() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, null);

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <KeyRound className="text-blue-600" size={28} />
            Seguridad de la Cuenta
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Actualiza tu contraseña para mantener tu cuenta segura.</p>
        </div>

        <form action={formAction} className="p-8 space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{state.error}</p>
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl flex items-center gap-3">
              <ShieldCheck size={20} />
              <p className="text-sm font-bold">¡Contraseña actualizada con éxito!</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Contraseña Actual</label>
              <input 
                name="currentPassword" 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div className="h-px bg-slate-100 my-2" />

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nueva Contraseña</label>
              <input 
                name="newPassword" 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Confirmar Nueva Contraseña</label>
              <input 
                name="confirmPassword" 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Cambios</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
