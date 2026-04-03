import { Sidebar } from "@/app/components/Sidebar";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar superior */}
        <Navbar />

        {/* Contenido dinámico con scroll independiente */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer al final del contenido */}
        <Footer />
      </div>
    </div>
  );
}
