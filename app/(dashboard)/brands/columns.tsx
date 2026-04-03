"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Brand } from "@prisma/client"
import { Pencil, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import { toast } from "sonner"
import { deleteBrand } from "@/lib/actions/brands"
import NextImage from "next/image" // Lo renombramos para evitar el conflicto
import { Image as ImageIcon } from "lucide-react" // Importamos el icono con un alias


// 1. Definición del tipo
export type BrandColumn = Brand & {
    _count: {
        products: number
    }
}

// 2. Definición de las columnas
export const columns: ColumnDef<BrandColumn>[] = [
    {
        accessorKey: "logo",
        header: "Logo",
        cell: ({ row }) => {
            const logo = row.original.logo;
            return (
                <div className="relative h-10 w-10 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                    {logo ? (
                        <NextImage
                            src={logo}
                            alt={row.original.name}
                            fill
                            className="object-contain p-1"
                        />
                    ) : (
                        <ImageIcon className="text-slate-300" size={18} />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.name}</div>
        ),
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 italic text-xs">
                {row.original.slug}
            </code>
        ),
    },
    {
        accessorKey: "_count.products",
        header: "Productos",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    {row.original._count.products} refs
                </span>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const { id, name } = row.original;

            // Accedemos a la función de editar que pasarás en el componente donde renderizas la tabla
            const meta = table.options.meta as {
                onEdit: (brand: BrandColumn) => void;
            };

            const handleDelete = async () => {
                const confirm = await Swal.fire({
                    title: `¿Eliminar ${name}?`,
                    text: "Esta acción es irreversible y fallará si existen productos vinculados.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ef4444",
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar",
                    reverseButtons: true,
                });

                if (confirm.isConfirmed) {
                    try {
                        const res = await deleteBrand(id);
                        if (res?.success) {
                            toast.success(`Marca "${name}" eliminada correctamente`);
                        } else {
                            toast.error(res?.error || "Error al eliminar");
                        }
                    } catch (error) {
                        toast.error("Ocurrió un error de conexión");
                    }
                }
            };

            return (
                <div className="flex items-center justify-end gap-2">
                    <button
                        className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                        title="Editar marca"
                        onClick={() => meta?.onEdit(row.original)} // <--- AQUÍ DISPARA EL MODAL
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        title="Eliminar marca"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            );
        },
    },
];
