"use client"

import { useState, useEffect } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { createBrand, updateBrand } from "@/lib/actions/brands"
import { X, Image as ImageIcon, Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import { BrandColumn } from "@/app/(dashboard)/brands/columns"

interface BrandFormProps {
    initialData?: BrandColumn | null; 
    onClose: () => void;
}

export function BrandForm({ initialData, onClose }: BrandFormProps) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [logo, setLogo] = useState("")

    // 1. Sincronizar el formulario cuando se abre para editar
    useEffect(() => {
        if (initialData) {
            setName(initialData.name)
            setLogo(initialData.logo || "")
        } else {
            setName("")
            setLogo("")
        }
    }, [initialData])

    const generateSlug = (text: string) => {
        return text.toLowerCase().trim()
            .replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return toast.error("El nombre es requerido")

        setLoading(true)
        
        // Solo generamos slug si es nuevo o si el nombre cambió (opcional)
        const slug = generateSlug(name)

        try {
            let response;
            
            if (initialData) {
                // MODO EDICIÓN
                response = await updateBrand(initialData.id, { name, slug, logo });
            } else {
                // MODO CREACIÓN
                response = await createBrand({ name, slug, logo });
            }

            if (response?.success) {
                toast.success(initialData ? "Marca actualizada" : "Marca creada correctamente")
                onClose()
            } else {
                toast.error(response?.error || "Ocurrió un error inesperado")
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-slate-800">
                        {initialData ? 'Editar Marca' : 'Nueva Marca'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Nombre de la Marca</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                            placeholder="Ej: Samsung, Sony..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Logo Oficial</label>
                        <CldUploadWidget
                            uploadPreset="ssergio"
                            onSuccess={(result: any) => {
                                setLogo(result.info.secure_url)
                                toast.success("Imagen cargada")
                            }}
                        >
                            {({ open }) => (
                                <div
                                    onClick={() => open()}
                                    className={`relative cursor-pointer w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${logo ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                                >
                                    {logo ? (
                                        <>
                                            <img src={logo} alt="Preview" className="h-28 w-full object-contain p-2" />
                                            <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full">
                                                <Check size={12} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-white shadow-sm rounded-xl text-slate-400 mb-2">
                                                <ImageIcon size={24} />
                                            </div>
                                            <span className="text-xs font-medium text-slate-500">Subir logo</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </CldUploadWidget>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50 flex justify-center items-center gap-2 transition-all shadow-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (initialData ? "Actualizar Cambios" : "Guardar Marca")}
                    </button>
                </form>
            </div>
        </div>
    )
}
