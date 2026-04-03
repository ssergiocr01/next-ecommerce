import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductsTable from "@/app/components/products/ProductsTable";

export default async function ProductsPage() {
  const productsRaw = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // ✅ CORRECCIÓN: Convertimos los objetos Decimal y Date a formatos planos
  const products = productsRaw.map((p) => ({
    ...p,
    price: p.price.toString(), // Convertimos Decimal a String
    createdAt: p.createdAt.toISOString(), // Convertimos Date a String
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Package className="text-blue-600" size={32} />
            Inventario de Productos
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestión inteligente de catálogo y existencias.
          </p>
        </div>

        <Link 
          href="/products/new"
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      {/* Renderizamos la tabla inteligente */}
      <ProductsTable data={products as any} />
    </div>
  );
}
