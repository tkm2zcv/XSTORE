'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, MessageSquare } from 'lucide-react'

const navigation = [
  { name: 'ダッシュボード', href: '/admin', icon: LayoutDashboard },
  { name: 'アカウント管理', href: '/admin/accounts', icon: Users },
  { name: '買取申込', href: '/admin/requests', icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">XSTORE Admin</h1>
      </div>
      <nav className="space-y-1 px-3">
        {navigation.map((item) => {
          // ダッシュボード（/admin）の場合は完全一致のみ
          // 他のページの場合は開始一致もチェック
          const isActive =
            item.href === '/admin'
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
