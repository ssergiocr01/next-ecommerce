import { prisma } from "@/lib/prisma";
import { History, Calendar, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns"; 
import { es } from "date-fns/locale";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AuditLogsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  // Obtener logs y el total para la paginación
  const [logs, totalLogs] = await Promise.all([
    prisma.auditLog.findMany({
      take: pageSize,
      skip: skip,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count()
  ]);

  const totalPages = Math.ceil(totalLogs / pageSize);

  const getBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "UPDATE": return "bg-amber-100 text-amber-700 border-amber-200";
      case "DELETE": return "bg-rose-100 text-rose-700 border-rose-200";
      case "VIEW": return "bg-sky-100 text-sky-700 border-sky-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <History className="text-blue-600" size={32} />
            Bitácora de Movimientos
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Historial de cambios. Mostrando {logs.length} de {totalLogs} registros.
          </p>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Entidad</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    Aún no hay movimientos registrados en el sistema.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {/* ✅ USO DE DATE-FNS */}
                        {format(log.createdAt, "d 'de' MMM, HH:mm", { locale: es })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                          {log.entity.substring(0, 3)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 line-clamp-1">{log.entityName || "—"}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-medium">{log.entity}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 max-w-md">
                        <Info size={14} className="text-slate-300 mt-1 shrink-0" />
                        <p className="text-sm text-slate-500 line-clamp-2">{log.details || "Sin detalles."}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINACIÓN --- */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500">
            Página <span className="text-slate-900 font-bold">{currentPage}</span> de {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/logs?page=${currentPage - 1}`}
              className={`p-2 rounded-xl border transition-all ${
                currentPage <= 1 
                ? "bg-slate-100 text-slate-300 pointer-events-none" 
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <ChevronLeft size={18} />
            </Link>
            
            <Link
              href={`/logs?page=${currentPage + 1}`}
              className={`p-2 rounded-xl border transition-all ${
                currentPage >= totalPages 
                ? "bg-slate-100 text-slate-300 pointer-events-none" 
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
