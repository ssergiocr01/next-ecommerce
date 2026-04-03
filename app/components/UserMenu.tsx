"use client";

import { useState } from "react";
import { LogOut, Key, ChevronDown } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import Link from "next/link"; // 1. Importamos Link

interface Props {
  name: string;
  role: string;
}

export const UserMenu = ({ name, role }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Botón Activador */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-xl transition-colors group"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
            {name}
          </p>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
            {role}
          </p>
        </div>
        
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md font-black border border-slate-800">
          {name.charAt(0).toUpperCase()}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
              <p className="text-xs text-slate-400 font-medium">Gestionar Cuenta</p>
            </div>
            
            {/* 2. Cambiamos el button por Link */}
            <Link 
              href="/profile/change-password" 
              onClick={() => setIsOpen(false)} // Cerramos el menú al hacer clic
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Key size={16} />
              Cambiar Contraseña
            </Link>

            <button 
              onClick={() => logoutAction()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
};
