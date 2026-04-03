"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Save, Loader2, ImageIcon, Package, 
  DollarSign, List, BarChart3, AlignLeft, 
  Tag, ArrowLeft 
} from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import ImageUpload from "./ImageUpload";
import { ActionResponse } from "@/lib/actions/auth";

interface ProductFormProps {
  categories: any[];
  brands: any[]; // 👈 Nueva prop para las marcas del seeder
  initialData?: any;
}

export default function ProductForm({ categories, brands, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isEditing = !!initialData;

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
    brandId: initialData?.brandId || (brands.length > 0 ? brands[0].id : ""), // 👈 Vinculación con marca
  });

  const [images, setImages] = useState<string[]>(initialData?.images || []);

  // 1. Generador de Slugs Automático (Solo en creación)
  useEffect(() => {
    if (!isEditing && formData.name && !isDirty) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEditing, isDirty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      return toast.error("Debes subir al menos una imagen para el producto.");
    }

    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price.toString()), // Aseguramos formato numérico para Prisma
        stock: parseInt(formData.stock.toString()),
        images
      };

      let result: ActionResponse = { success: false };

      if (isEditing && initialData) {
        result = await updateProduct(initialData.id, dataToSave);
      } else {
        result = await createProduct(dataToSave);
      }

      if (result && result.success) {
        setIsDirty(false);
        toast.success(isEditing ? "Producto actualizado correctamente" : "Producto publicado con éxito");
        router.push("/products");
        router.refresh();
      } else {
        toast.error(result?.error || "Ocurrió un error al procesar la solicitud.");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECCIÓN 1: GALERÍA (CLOUDINARY) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <label className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
          <ImageIcon size={18} className="text-blue-600" /> Galería de Imágenes
        </label>
        <ImageUpload 
          value={images}
          onChange={(url) => {
            setImages([...images, url]);
            setIsDirty(true);
          }}
          onRemove={(url) => {
            setImages(images.filter(img => img !== url));
            setIsDirty(true);
          }}
        />
      </div>

      {/* SECCIÓN 2: DATOS DEL PRODUCTO */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nombre */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <Package size={14} /> Nombre del Producto
          </label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-medium"
            placeholder="Ej: Leche Entera Dos Pinos 1L"
          />
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <List size={14} /> Categoría
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none focus:border-blue-600 cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Marca (Nueva funcionalidad) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <Tag size={14} /> Marca
          </label>
          <select
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none focus:border-blue-600 cursor-pointer"
          >
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Precio */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <DollarSign size={14} /> Precio Venta (CRC)
          </label>
          <input
            required
            name="price"
            type="number" 
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-bold text-lg"
            placeholder="0.00"
          />
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <BarChart3 size={14} /> Existencias en Bodega
          </label>
          <input
            required
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-bold text-lg"
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <AlignLeft size={14} /> Descripción / Especificaciones
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all resize-none font-medium"
            placeholder="Detalla las características del producto..."
          />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="flex-1 px-6 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest text-sm"
        >
          Descartar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 uppercase tracking-widest"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={22} />}
          {isEditing ? "Confirmar Cambios" : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
