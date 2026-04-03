"use client"

import { Trash2, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCategory } from "@/lib/actions/categories";
import { useState } from "react";

export default function DeleteCategoryButton({ id, name }: { id: string, name: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteCategory(id);

      // ✅ CORRECCIÓN: Validamos que result no sea null antes de usarlo
      if (!result) {
        toast.error("No se recibió respuesta del servidor.");
        return;
      }

      if (result.success) {
        toast.success(`"${name}" eliminada correctamente.`);
      } else {
        toast.error(result.error || "No se pudo eliminar.");
        setShowConfirm(false);
      }
    } catch (error) {
      toast.error("Error de red o del servidor.");
    } finally {
      setIsDeleting(false);
    }
  };


  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">¿Confirmar?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm disabled:opacity-50"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
      title="Eliminar categoría"
    >
      <Trash2 size={18} />
    </button>
  );
}
