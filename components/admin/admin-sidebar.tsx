"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8 p-2">
        <h1 className="text-xl font-bold">QuiCake Admin</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
              pathname === item.href ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800",
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.title}
          </Link>
        ))}

        <button
          onClick={() => logout()}
          className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  )
}
