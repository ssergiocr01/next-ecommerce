import Link from "next/link";
import { Plus, LayoutGrid, Search, ChevronLeft, ChevronRight, Image as ImageIcon, Edit } from "lucide-react";
import { prisma } from "@/lib/prisma"; // ✅ Import corregido
import DeleteCategoryButton from "@/app/components/categories/DeleteCategoryButton";
import { createLog } from "@/lib/actions/logging";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriesPage({ searchParams }: Props) {
  // 1. Configuración de paginación
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 5; // Cantidad de elementos por página
  const skip = (currentPage - 1) * pageSize;

  // 2. Obtener datos y total en paralelo
  const [categories, totalCategories] = await Promise.all([
    prisma.category.findMany({
      take: pageSize,
      skip: skip,
      orderBy: { name: 'asc' }
    }),
    prisma.category.count()
  ]);

  const totalPages = Math.ceil(totalCategories / pageSize);

  createLog({
    action: "VIEW",
    entity: "CATEGORY",
    details: `El administrador consultó la lista de categorías (Página ${currentPage})`
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <LayoutGrid className="text-blue-600" size={32} />
            Categorías
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Mostrando {categories.length} de {totalCategories} registros.
          </p>
        </div>

        <Link 
          href="/categories/new"
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
        >
          <Plus size={20} />
          Nueva Categoría
        </Link>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Imagen</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Descripción</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((category) => (
                <tr key={category.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border overflow-hidden">
                      {category.image ? (
                        <img src={category.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <ImageIcon className="w-full h-full p-3 text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{category.name}</div>
                    <div className="text-xs text-slate-400 font-mono">/{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {category.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/categories/edit/${category.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteCategoryButton id={category.id} name={category.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- CONTROLES DE PAGINACIÓN --- */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Página <span className="font-bold text-slate-900">{currentPage}</span> de {totalPages}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/categories?page=${currentPage - 1}`}
              className={`p-2 rounded-lg border transition-all ${
                currentPage <= 1 
                ? "bg-slate-100 text-slate-300 pointer-events-none" 
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <ChevronLeft size={20} />
            </Link>
            
            <Link
              href={`/categories?page=${currentPage + 1}`}
              className={`p-2 rounded-lg border transition-all ${
                currentPage >= totalPages 
                ? "bg-slate-100 text-slate-300 pointer-events-none" 
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
