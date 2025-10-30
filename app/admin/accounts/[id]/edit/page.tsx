import { createServerClient } from '@/lib/supabase'
import { AccountForm } from '@/components/admin/AccountForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface EditAccountPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditAccountPage({ params }: EditAccountPageProps) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: account, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !account) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/accounts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">アカウント編集</h1>
      </div>

      <AccountForm mode="edit" account={account} />
    </div>
  )
}
