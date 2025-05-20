import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser, isAdmin } from "@/server/auth/auth-service"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if user is admin
  const user = await getCurrentUser()
  const admin = await isAdmin()

  if (!user || !admin) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
