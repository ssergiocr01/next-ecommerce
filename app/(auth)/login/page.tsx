"use client";

import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { loginAction } from "@/lib/actions/auth";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Asegúrate que diga 'navigation'
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  // state recibirá el mensaje de error desde la Server Action
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }

    if (state?.success) {
      toast.success("¡Inicio de sesión exitoso!");
      router.push("/");
      router.refresh(); // Crucial para actualizar el Navbar con tu nombre
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
      {/* Encabezado con Estilo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4 rotate-3">
          <span className="text-white text-3xl font-black -rotate-3">Db</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ¡Bienvenido!
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {/* MENSAJE DE ERROR DINÁMICO */}
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-bounce-short">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{state.error}</p>
          </div>
        )}

        {/* Input de Correo */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Correo Electrónico
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Mail size={18} />
            </div>
            <input
              name="email"
              type="email"
              placeholder="admin@ecommerce.com"
              required
              disabled={isPending}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Input de Contraseña */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-slate-700">
              Contraseña
            </label>
            <a href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              ¿La olvidaste?
            </a>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Lock size={18} />
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Botón Principal con Estado de Carga */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
        >
          {isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Entrar al Sistema
            </>
          )}
        </button>
      </form>

      {/* Pie de página del Formulario */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600 font-medium">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Crea una ahora
          </Link>
        </p>
      </div>
    </div>
  );
}
