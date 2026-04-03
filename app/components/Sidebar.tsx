import { LayoutDashboard, ShoppingBag, List, Users, Settings, Package } from "lucide-react";
import Link from "next/link";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Productos", icon: Package, href: "/products" },
    { name: "Categorías", icon: List, href: "/categories" },
    { name: "Ordenes", icon: ShoppingBag, href: "/orders" },
    { name: "Clientes", icon: Users, href: "/users" },
    { name: "Ajustes", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
    return (
        <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 h-full">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">E</div>
                    DbEcommerce
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all group"
                    >
                        <item.icon size={20} className="group-hover:text-blue-400 transition-colors" />
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};