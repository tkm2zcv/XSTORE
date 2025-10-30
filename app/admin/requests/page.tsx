'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RequestTable } from '@/components/admin/RequestTable'
import { logger } from '@/lib/logger'
import type { PurchaseRequest } from '@/types'

export default function RequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, statusFilter])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/purchase-requests?limit=1000')
      const json = await res.json()

      // データが配列であることを確認
      const data = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : []

      setRequests(data)
    } catch (error) {
      logger.error('Failed to fetch purchase requests', error as Error)
      setRequests([]) // エラー時も空配列を設定
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = [...requests]

    if (statusFilter !== 'all') {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/purchase-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status } : request
          )
        )
      }
    } catch (error) {
      logger.error('Failed to update request status', error as Error, { requestId: id, newStatus: status })
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
        <h1 className="text-3xl font-bold">買取申込管理</h1>
      </div>

      {/* フィルター */}
      <div className="flex gap-4 items-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="pending">未対応</SelectItem>
            <SelectItem value="reviewing">確認中</SelectItem>
            <SelectItem value="approved">承認済み</SelectItem>
            <SelectItem value="rejected">却下</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 統計情報 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">総申込数</div>
          <div className="text-2xl font-bold">{requests.length}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">未対応</div>
          <div className="text-2xl font-bold text-yellow-600">
            {requests.filter((r) => r.status === 'pending').length}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">確認中</div>
          <div className="text-2xl font-bold text-blue-600">
            {requests.filter((r) => r.status === 'reviewing').length}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">承認済み</div>
          <div className="text-2xl font-bold text-green-600">
            {requests.filter((r) => r.status === 'approved').length}
          </div>
        </div>
      </div>

      {/* 申込テーブル */}
      <RequestTable
        requests={filteredRequests}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
