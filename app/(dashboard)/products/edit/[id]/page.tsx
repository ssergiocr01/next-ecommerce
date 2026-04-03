import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/app/components/products/ProductForm";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  // 1. Obtenemos el producto y todas las categorías para el selector
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
        <ArrowLeft size={20} /> Volver al inventario
      </Link>

      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
          <Package size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Editar Producto</h1>
          <p className="text-slate-500 font-medium tracking-tight">Modificando: {product.name}</p>
        </div>
      </div>

      {/* Pasamos los datos serializados para evitar errores de Decimal/Date */}
      <ProductForm 
        categories={categories} 
        initialData={{
          ...product,
          price: product.price.toString() // Convertimos Decimal a string para el input
        }} 
      />
    </div>
  );
}
