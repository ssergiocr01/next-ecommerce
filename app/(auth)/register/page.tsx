"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... encabezado igual ... */}

      <form action={formAction} className="space-y-5">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{state.error}</p>
          </div>
        )}

        {/* Campo Nombre */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">Nombre</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-blue-600">
              <User size={18} />
            </div>
            <input name="name" type="text" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600" />
          </div>
        </div>

        {/* Campo Correo */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">Correo</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-blue-600">
              <Mail size={18} />
            </div>
            <input name="email" type="email" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600" />
          </div>
        </div>

        {/* Campo Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-blue-600">
              <Lock size={18} />
            </div>
            <input name="password" type="password" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600" />
          </div>
        </div>

        <button disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
          {isPending ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Registrarse</>}
        </button>
      </form>

      {/* Pie de página */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600 font-medium">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
