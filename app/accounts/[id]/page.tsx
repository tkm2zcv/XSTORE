import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AccountDetail } from '@/components/accounts/AccountDetail'
import { RelatedAccounts } from '@/components/accounts/RelatedAccounts'
import { mockAccounts } from '@/lib/mock-data'
import { Account } from '@/types'

function getAccount(id: string): Account | null {
  const account = mockAccounts.find((acc) => acc.id === id)
  if (!account || account.status !== 'available') {
    return null
  }
  return account
}

function getRelatedAccounts(category: string, currentId: string): Account[] {
  return mockAccounts
    .filter(
      (acc) =>
        acc.category === category &&
        acc.id !== currentId &&
        acc.status === 'available'
    )
    .slice(0, 3)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const account = getAccount(id)

  if (!account) {
    return {
      title: 'アカウントが見つかりません | XSTORE',
      description: 'お探しのアカウントは存在しないか、既に売却済みです。',
    }
  }

  return {
    title: `${account.display_name} - フォロワー${account.followers_count.toLocaleString()}人 | XSTORE`,
    description: `${account.category}カテゴリのTwitterアカウント。フォロワー${account.followers_count.toLocaleString()}人、投稿数${account.tweets_count.toLocaleString()}件。価格：¥${account.price.toLocaleString()}`,
    openGraph: {
      title: `${account.display_name} | XSTORE`,
      description: `フォロワー${account.followers_count.toLocaleString()}人のTwitterアカウント`,
      images: [
        {
          url: account.image_url || '/og-image.png',
          width: 1200,
          height: 630,
          alt: account.display_name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${account.display_name} | XSTORE`,
      description: `フォロワー${account.followers_count.toLocaleString()}人のTwitterアカウント`,
      images: [account.image_url || '/og-image.png'],
    },
  }
}

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const account = getAccount(id)

  if (!account) {
    notFound()
  }

  const relatedAccounts = getRelatedAccounts(account.category, account.id)

  return (
    <div className="container py-8">
      <AccountDetail account={account} />
    </div>
  )
}
