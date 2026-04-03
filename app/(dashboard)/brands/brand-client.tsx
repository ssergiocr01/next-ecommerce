"use client"

import { useState } from "react"
import { columns, BrandColumn } from "./columns" // Las columnas se importan AQUÍ
import { DataTable } from "@/app/components/ui/data-table"
import { BrandClientHeader } from "@/app/components/brands/BrandClientHeader"
import { BrandForm } from "@/app/components/brands/BrandForm"

export function BrandClient({ initialData }: { initialData: BrandColumn[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<BrandColumn | null>(null)

  const onEdit = (brand: BrandColumn) => {
    setSelectedBrand(brand)
    setIsOpen(true)
  }

  const onNew = () => {
    setSelectedBrand(null)
    setIsOpen(true)
  }

  return (
    <div className="p-8 pt-6 space-y-4">
      <BrandClientHeader total={initialData.length} onAction={onNew} />
      
      {isOpen && (
        <BrandForm 
          initialData={selectedBrand} 
          onClose={() => {
            setIsOpen(false)
            setSelectedBrand(null)
          }} 
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <DataTable 
          columns={columns} 
          data={initialData} 
          searchKey="name" 
          meta={{ onEdit }} 
        />
      </div>
    </div>
  )
}
