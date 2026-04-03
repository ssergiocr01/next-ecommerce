// app/not-found.tsx
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { getAuthUser } from "@/lib/actions/auth";
import { Sidebar } from "./components/Sidebar"; // Ajusta la ruta a tu componente
import { Navbar } from "./components/Navbar";   // Ajusta la ruta a tu componente

export default async function NotFound() {
  const user = await getAuthUser();

  // Si el usuario está logueado, le mostramos el error DENTRO del Dashboard
  if (user) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
             <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-lg">
                <FileQuestion size={64} className="text-blue-600 mx-auto mb-4" />
                <h1 className="text-4xl font-black text-slate-900 mb-2">404</h1>
                <p className="text-slate-500 font-medium mb-8">
                  Esta sección aún no ha sido creada o la URL es incorrecta.
                </p>
                <Link href="/dashboard" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                  <ArrowLeft size={18} /> Volver al inicio
                </Link>
             </div>
          </main>
        </div>
      </div>
    );
  }

  // Si NO está logueado (ej: error en /login), mostramos pantalla completa simple
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-center p-6">
      <h1 className="text-9xl font-black text-slate-200">404</h1>
      <p className="text-slate-500 mb-6 font-medium">Página no encontrada</p>
      <Link href="/login" className="text-blue-600 font-bold underline">Ir al Login</Link>
    </div>
  );
}
