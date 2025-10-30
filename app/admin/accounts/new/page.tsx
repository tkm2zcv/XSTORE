import { AccountForm } from '@/components/admin/AccountForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NewAccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/accounts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">新規アカウント出品</h1>
      </div>

      <AccountForm mode="create" />
    </div>
  )
}
