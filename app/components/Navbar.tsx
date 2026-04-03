import { Bell, Search } from "lucide-react";
import { getAuthUser } from "@/lib/actions/auth";
import { UserMenu } from "./UserMenu"; 

// 1. Definimos la interfaz para que acepte la prop 'user' opcionalmente
interface NavbarProps {
  user?: {
    name: string | null;
    role: any;
    email: string;
  } | null;
}

// 2. Si no recibe 'user', lo busca por su cuenta
export const Navbar = async ({ user: propUser }: NavbarProps) => {
  // Si no pasamos el usuario por props (como en el layout normal), lo buscamos
  const user = propUser || await getAuthUser();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-80 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <Search size={18} className="text-gray-400 group-focus-within:text-blue-600" />
        <input 
          type="text" 
          placeholder="Buscar en el sistema..." 
          className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-gray-600 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-blue-600 transition-colors p-2">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200" />

        <UserMenu 
          name={user?.name || user?.email || "Usuario"} 
          role={user?.role || "USER"} 
        />
      </div>
    </header>
  );
};
