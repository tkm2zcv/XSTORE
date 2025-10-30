'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AccountTable } from '@/components/admin/AccountTable'
import { logger } from '@/lib/logger'
import { Plus, Search } from 'lucide-react'
import type { Account } from '@/types'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    filterAccounts()
  }, [accounts, searchQuery, statusFilter, categoryFilter])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts?limit=1000')
      const json = await res.json()

      // データが配列であることを確認
      const data = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : []

      setAccounts(data)
    } catch (error) {
      logger.error('Failed to fetch accounts', error as Error)
      setAccounts([]) // エラー時も空配列を設定
    } finally {
      setLoading(false)
    }
  }

  const filterAccounts = () => {
    let filtered = [...accounts]

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter((account) =>
        account.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // ステータスフィルター
    if (statusFilter !== 'all') {
      filtered = filtered.filter((account) => account.status === statusFilter)
    }

    // カテゴリーフィルター
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (account) => account.category === categoryFilter
      )
    }

    setFilteredAccounts(filtered)
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setAccounts((prev) =>
          prev.map((account) =>
            account.id === id ? { ...account, status } : account
          )
        )
      }
    } catch (error) {
      logger.error('Failed to update account status', error as Error, { accountId: id, newStatus: status })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setAccounts((prev) => prev.filter((account) => account.id !== id))
      }
    } catch (error) {
      logger.error('Failed to delete account', error as Error, { accountId: id })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">アカウント管理</h1>
        <Button asChild>
          <Link href="/admin/accounts/new">
            <Plus className="h-4 w-4 mr-2" />
            新規出品
          </Link>
        </Button>
      </div>

      {/* フィルター */}
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ユーザー名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="available">販売中</SelectItem>
            <SelectItem value="sold">売却済み</SelectItem>
            <SelectItem value="pending">保留中</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="ビジネス">ビジネス</SelectItem>
            <SelectItem value="エンタメ">エンタメ</SelectItem>
            <SelectItem value="スポーツ">スポーツ</SelectItem>
            <SelectItem value="ニュース">ニュース</SelectItem>
            <SelectItem value="その他">その他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 統計情報 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">総アカウント数</div>
          <div className="text-2xl font-bold">{accounts.length}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">販売中</div>
          <div className="text-2xl font-bold text-green-600">
            {accounts.filter((a) => a.status === 'available').length}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">売却済み</div>
          <div className="text-2xl font-bold text-gray-500">
            {accounts.filter((a) => a.status === 'sold').length}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">保留中</div>
          <div className="text-2xl font-bold text-yellow-600">
            {accounts.filter((a) => a.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* アカウントテーブル */}
      <AccountTable
        accounts={filteredAccounts}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  )
}
