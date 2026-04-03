import { Toaster } from 'sonner'; // 1. Importamos Toaster
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        {/* 2. Añadimos el componente con estilo profesional */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
