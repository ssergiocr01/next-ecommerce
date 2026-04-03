import { Bell, Search, UserCircle } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full w-72">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-gray-600"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-blue-600 transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">Sergio Castro</p>
            <p className="text-xs text-gray-500 font-medium">Administrador</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
            <UserCircle size={28} />
          </div>
        </div>
      </div>
    </header>
  );
};
