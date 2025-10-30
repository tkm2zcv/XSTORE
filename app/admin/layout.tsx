import { requireAuth } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication check
  // Note: The middleware already handles redirection,
  // but this provides an additional layer of security
  let session
  try {
    session = await requireAuth()
  } catch (error) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader session={session} />
        <main className="flex-1 p-6 bg-muted/10">{children}</main>
      </div>
    </div>
  )
}
