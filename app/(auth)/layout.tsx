export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        {/* Aquí podrías poner un logo pequeño arriba del formulario */}
        <div className="flex justify-center mb-8">
           <span className="text-2xl font-bold text-blue-600">DbEcommerce</span>
        </div>
        {children}
      </div>
    </div>
  );
}
