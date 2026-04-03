"use client"

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { 
  Search, ChevronLeft, ChevronRight, ArrowUpDown, 
  Edit, ImageIcon, AlertTriangle, PackageOpen 
} from "lucide-react";
import Link from "next/link";
import DeleteProductButton from "./DeleteProductButton";

// Definimos la estructura de los datos para TS
interface ProductWithCategory {
  id: string;
  name: string;
  price: any;
  stock: number;
  images: string[];
  category: { name: string };
}

const columnHelper = createColumnHelper<ProductWithCategory>();

export default function ProductsTable({ data }: { data: ProductWithCategory[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Definición de Columnas
  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Producto",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            {info.row.original.images?.[0] ? (
              <img src={info.row.original.images[0]} className="w-full h-full object-cover" alt="" />
            ) : (
              <ImageIcon className="w-full h-full p-2.5 text-slate-300" />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900 line-clamp-1">{info.getValue()}</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
              ID: {info.row.original.id.substring(0, 8)}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("category.name", {
      header: "Categoría",
      cell: (info) => (
        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase border border-blue-100">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("price", {
      header: ({ column }) => (
        <button 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
        >
          Precio <ArrowUpDown size={14} />
        </button>
      ),
      cell: (info) => (
        <div className="text-center font-black text-slate-900">
          {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(Number(info.getValue()))}
        </div>
      ),
    }),
    columnHelper.accessor("stock", {
      header: ({ column }) => (
        <button 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
        >
          Stock <ArrowUpDown size={14} />
        </button>
      ),
      cell: (info) => {
        const stock = info.getValue();
        return (
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
              stock === 0 ? "bg-red-50 text-red-600 border border-red-100" :
              stock < 10 ? "bg-amber-50 text-amber-600 border border-amber-100" :
              "bg-emerald-50 text-emerald-600 border border-emerald-100"
            }`}>
              {stock < 5 && <AlertTriangle size={12} />}
              {stock} und.
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: (info) => (
        <div className="flex justify-end gap-2">
          <Link 
            href={`/products/edit/${info.row.original.id}`}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Edit size={18} />
          </Link>
          <DeleteProductButton id={info.row.original.id} name={info.row.original.name} />
        </div>
      ),
    }),
  ], []);

  // Inicialización de TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 }, // 👈 Configurado a 10 registros
    },
  });

  return (
    <div className="space-y-4">
      {/* Buscador Integrado */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Filtrar por nombre, categoría o ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Tabla con Diseño Profesional */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="group hover:bg-slate-50/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <PackageOpen size={48} className="mb-2 opacity-20" />
                      <p className="font-medium italic">No se encontraron productos que coincidan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación de TanStack */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">
            Página <span className="text-slate-900">{table.getState().pagination.pageIndex + 1}</span> de {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-xl border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-xl border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
