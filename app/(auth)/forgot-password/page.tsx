"use client";

import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de envío (Aquí luego conectaremos con la Server Action)
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 border-4 border-white rounded-2xl shadow-sm mb-4">
          <Mail className="text-blue-600" size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isSent ? "¡Correo enviado!" : "¿Olvidaste tu clave?"}
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          {isSent 
            ? "Revisa tu bandeja de entrada para continuar." 
            : "No te preocupes, te enviaremos instrucciones."}
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Tu Correo Electrónico
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="admin@ecommerce.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? "Enviando..." : <><Send size={18} /> Enviar Instrucciones</>}
          </button>
        </form>
      ) : (
        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-start gap-3">
          <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
          <p className="text-sm text-green-800 font-medium leading-relaxed">
            Si el correo está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña en unos minutos.
          </p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
