"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  TableMeta, // Importamos el tipo Meta
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey: string
  meta?: TableMeta<TData> // <-- Nueva prop para funciones como onEdit
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  meta, // <-- Recibimos meta
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    meta, // <-- PASAMOS META A LA TABLA
  })

  const searchColumn = table.getColumn(searchKey)

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <input
          placeholder={`Filtrar por ${searchKey}...`}
          value={(searchColumn?.getFilterValue() as string) ?? ""}
          onChange={(event) => searchColumn?.setFilterValue(event.target.value)}
          className="max-w-sm p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
        />
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200 text-xs uppercase tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center text-slate-400">
                   Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex items-center justify-between py-4">
        <div className="text-xs text-slate-500">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all active:scale-95"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all active:scale-95"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
