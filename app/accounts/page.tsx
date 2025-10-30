import { Metadata } from 'next'
import { AccountList } from '@/components/accounts/AccountList'
import { AccountFilter } from '@/components/accounts/AccountFilter'
import { MobileFilter } from '@/components/accounts/MobileFilter'
import { mockAccounts } from '@/lib/mock-data'
import { Account } from '@/types'

export const metadata: Metadata = {
  title: '販売中アカウント一覧 | XSTORE',
  description: '購入可能なTwitterアカウントを探す',
}

interface SearchParams {
  page?: string
  minPrice?: string
  maxPrice?: string
  minFollowers?: string
  category?: string
  sort?: string
  search?: string
}

async function getAccounts(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  let filteredAccounts = [...mockAccounts]

  // フィルター適用
  if (searchParams.minPrice) {
    const minPrice = parseInt(searchParams.minPrice)
    filteredAccounts = filteredAccounts.filter(
      (account) => account.price >= minPrice
    )
  }

  if (searchParams.maxPrice) {
    const maxPrice = parseInt(searchParams.maxPrice)
    filteredAccounts = filteredAccounts.filter(
      (account) => account.price <= maxPrice
    )
  }

  if (searchParams.minFollowers) {
    const minFollowers = parseInt(searchParams.minFollowers)
    filteredAccounts = filteredAccounts.filter(
      (account) => account.followers_count >= minFollowers
    )
  }

  if (searchParams.category) {
    filteredAccounts = filteredAccounts.filter(
      (account) => account.category === searchParams.category
    )
  }

  if (searchParams.search) {
    const search = searchParams.search.toLowerCase()
    filteredAccounts = filteredAccounts.filter((account) =>
      account.display_name.toLowerCase().includes(search)
    )
  }

  // ソート適用
  const sort = searchParams.sort || 'newest'
  switch (sort) {
    case 'price-asc':
      filteredAccounts.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filteredAccounts.sort((a, b) => b.price - a.price)
      break
    case 'followers-desc':
      filteredAccounts.sort((a, b) => b.followers_count - a.followers_count)
      break
    case 'followers-asc':
      filteredAccounts.sort((a, b) => a.followers_count - b.followers_count)
      break
    case 'newest':
    default:
      filteredAccounts.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      break
  }

  const total = filteredAccounts.length
  const totalPages = Math.ceil(total / limit)

  // ページネーション
  const paginatedAccounts = filteredAccounts.slice(offset, offset + limit)

  return { accounts: paginatedAccounts, total, totalPages }
}

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { accounts, total, totalPages } = await getAccounts(params)
  const currentPage = parseInt(params.page || '1')

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">販売中アカウント</h1>
        <p className="text-muted-foreground">
          あなたにぴったりのアカウントを見つけましょう
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* デスクトップ用フィルター */}
        <aside className="hidden lg:block">
          <AccountFilter />
        </aside>

        {/* メインコンテンツエリア */}
        <div>
          {/* モバイル用フィルターボタン */}
          <MobileFilter />

          <AccountList
            accounts={accounts}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}
