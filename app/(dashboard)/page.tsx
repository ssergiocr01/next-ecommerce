export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          ¡Bienvenido al <span className="text-blue-600">Dashboard</span>!
        </h1>
        <p className="text-slate-500 mt-4 text-lg font-medium">
          Tu sistema de e-commerce profesional está listo para empezar.
        </p>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold">
            Estadísticas Próximamente
          </div>
          <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold">
            Órdenes Recientes
          </div>
          <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold">
            Nuevos Clientes
          </div>
        </div>
      </div>
    </div>
  );
}
