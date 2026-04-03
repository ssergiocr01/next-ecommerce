"use client" // Obligatorio para detectar la ruta actual

import { LayoutDashboard, ShoppingBag, List, Users, Settings, Package, History, Tag,  } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Productos", icon: Package, href: "/products" },
    { name: "Categorías", icon: List, href: "/categories" },
    { name: "Marcas", icon: Tag, href: "/brands" },
    { name: "Ordenes", icon: ShoppingBag, href: "/orders" },
    { name: "Clientes", icon: Users, href: "/users" },
    { name: "Ajustes", icon: Settings, href: "/settings" },
    { name: "Bitácora", icon: History, href: "/logs" },
];

export const Sidebar = () => {
    const pathname = usePathname(); // Detecta en qué URL estamos

    return (
        <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 h-full">
            <div className="p-6 border-b border-slate-800">
                <Link href="/dashboard" className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">E</div>
                    DbEcommerce
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    // Verifica si el link actual coincide con la ruta
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                                isActive 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                : "hover:bg-slate-900 hover:text-white"
                            }`}
                        >
                            <item.icon 
                                size={20} 
                                className={isActive ? "text-white" : "group-hover:text-blue-400 transition-colors"} 
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
