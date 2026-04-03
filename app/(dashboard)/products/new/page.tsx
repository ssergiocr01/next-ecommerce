import { prisma } from "@/lib/prisma";
import ProductForm from "@/app/components/products/ProductForm";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  // 1. Obtenemos las categorías para que el usuario pueda elegir una
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Botón Volver */}
      <Link 
        href="/products" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
      >
        <ArrowLeft size={20} />
        Volver al inventario
      </Link>

      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-sm">
          <Package size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Producto</h1>
          <p className="text-slate-500 font-medium">Registra un nuevo artículo en tu catálogo de supermercado.</p>
        </div>
      </div>

      {/* Formulario de Producto */}
      <ProductForm categories={categories} />
    </div>
  );
}
