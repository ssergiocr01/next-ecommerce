"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from 'sweetalert2';
import { Save, Loader2, Image as ImageIcon, Type, Link as LinkIcon, AlignLeft } from "lucide-react";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { ActionResponse } from "@/lib/actions/auth";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // 🚩 Estado para detectar cambios
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
  });

  // 1. Bloqueo de cierre de pestaña/navegador (Evento Nativo)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Muestra el mensaje estándar del navegador
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // 2. Generador automático de Slugs
  useEffect(() => {
    if (!isEditing && formData.name && !isDirty) { // Solo autogenera si no hemos editado el slug manualmente
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, isEditing, isDirty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true); // 🚩 Marcamos que el formulario ha sido modificado
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result: ActionResponse = { success: false };

      if (isEditing && initialData) {
        result = await updateCategory(initialData.id, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result && result.success) {
        setIsDirty(false);
        toast.success(isEditing ? "Categoría actualizada" : "Categoría creada");
        router.push("/categories");
        router.refresh();
      } else {
        toast.error(result?.error || "Ocurrió un error inesperado");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar con SweetAlert
  const handleCancel = () => {
    if (isDirty) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Tienes cambios sin guardar que se perderán permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0f172a', // Slate 900
        cancelButtonColor: '#94a3b8', // Slate 400
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Continuar editando',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/categories");
        }
      });
    } else {
      router.push("/categories");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Type size={16} className="text-blue-500" /> Nombre
          </label>
          <input
            required
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Electrónica"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <LinkIcon size={16} className="text-blue-500" /> Slug
          </label>
          <input
            required
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleChange}
            placeholder="ej-categoria"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <ImageIcon size={16} className="text-blue-500" /> URL Imagen
        </label>
        <input
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <AlignLeft size={16} className="text-blue-500" /> Descripción
        </label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all resize-none"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all order-2 md:order-1"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 order-1 md:order-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEditing ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
