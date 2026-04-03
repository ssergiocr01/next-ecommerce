import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert size={80} className="text-amber-500 mb-4" />
      <h1 className="text-3xl font-black text-slate-900">Acceso Restringido</h1>
      <p className="text-slate-500 max-w-sm mt-2">
        No tienes los permisos necesarios para ver esta sección. Contacta al administrador.
      </p>
    </div>
  );
}
