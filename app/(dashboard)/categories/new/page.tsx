import { LayoutGrid, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CategoryForm from "@/app/components/categories/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Botón Volver */}
      <Link 
        href="/categories" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Volver al listado
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Encabezado Estilizado */}
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <LayoutGrid size={24} />
            </div>
            Nueva Categoría
          </h1>
          <p className="text-slate-500 mt-1 font-medium tracking-tight">
            Crea un nuevo grupo para organizar tus productos.
          </p>
        </div>

        {/* Formulario Reutilizable */}
        <div className="p-8">
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}
