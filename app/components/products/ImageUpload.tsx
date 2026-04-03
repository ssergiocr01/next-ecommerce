"use client"

import { CldUploadWidget } from 'next-cloudinary';
import { ImageIcon, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-200 group">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                type="button" 
                onClick={() => onRemove(url)}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <Image fill src={url} alt="Producto" className="object-cover" />
          </div>
        ))}

        <CldUploadWidget 
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result: any) => onChange(result.info.secure_url)}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-400 transition-all text-slate-400 hover:text-blue-600"
            >
              <Plus size={24} />
              <span className="text-xs font-bold uppercase">Subir Foto</span>
            </button>
          )}
        </CldUploadWidget>
      </div>
    </div>
  );
}
