import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Obtener la sesión de las cookies (Asegúrate que el nombre coincida con tu sistema de auth)
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // 2. Definir rutas protegidas (Dashboard, Categorías, Productos, Logs)
  const isDashboardRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/categories") || 
                           pathname.startsWith("/products") || 
                           pathname.startsWith("/logs");

  // 3. Si no hay sesión y trata de entrar a una ruta protegida -> Login
  if (!session && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Lógica de Roles (ADMIN vs USER)
  if (session && isDashboardRoute) {
    try {
      // Decodificamos el valor de la sesión (Asumiendo que guardaste el rol en la cookie)
      // Si tu cookie está encriptada, necesitarás una lógica de desencriptado aquí.
      const userData = JSON.parse(session); 

      if (userData.role !== "ADMIN" && pathname !== "/unauthorized") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      // Si la cookie está corrupta o no es JSON, mandamos a login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// 5. Configurar en qué rutas se debe ejecutar este middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categories/:path*",
    "/products/:path*",
    "/logs/:path*",
  ],
};
