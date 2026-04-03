import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LayoutGrid, ChevronLeft } from "lucide-react";
import Link from "next/link";
import CategoryForm from "@/app/components/categories/CategoryForm"; // Reutilizamos el formulario

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;

  // 1. Buscar la categoría en la DB
  const category = await prisma.category.findUnique({
    where: { id },
  });

  // 2. Si no existe, mostrar error 404 de Next.js
  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Botón Volver */}
      <Link 
        href="/categories" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <ChevronLeft size={20} />
        Volver a categorías
      </Link>

      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
          <LayoutGrid size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Editar Categoría</h1>
          <p className="text-slate-500 font-medium">Modifica los detalles de "{category.name}"</p>
        </div>
      </div>

      {/* Formulario de Edición */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}
