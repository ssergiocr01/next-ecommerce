"use client"
import { Trash2, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteProduct } from "@/lib/actions/products";
import { toast } from "sonner";

export default function DeleteProductButton({ id, name }: { id: string, name: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteProduct(id);
    if (res?.success) toast.success(`"${name}" eliminado`);
    else toast.error(res?.error || "Error");
    setIsDeleting(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1 animate-in slide-in-from-right-2">
        <button onClick={handleDelete} className="p-2 bg-red-600 text-white rounded-lg">
          {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
        </button>
        <button onClick={() => setShowConfirm(false)} className="p-2 bg-slate-100 rounded-lg"><X size={14} /></button>
      </div>
    );
  }

  return (
    <button onClick={() => setShowConfirm(true)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
      <Trash2 size={18} />
    </button>
  );
}
