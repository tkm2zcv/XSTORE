import { Account } from '@/types'
import { AccountCard } from './AccountCard'

interface RelatedAccountsProps {
  accounts: Account[]
}

export function RelatedAccounts({ accounts }: RelatedAccountsProps) {
  if (accounts.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">関連アカウント</h2>
      </div>
      <p className="mb-6 text-muted-foreground">
        同じカテゴリの他のアカウントをご覧ください
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  )
}
