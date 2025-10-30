'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import type { PurchaseRequest } from '@/types'

interface RequestTableProps {
  requests: PurchaseRequest[]
  onStatusChange: (id: string, status: string) => Promise<void>
}

export function RequestTable({
  requests,
  onStatusChange,
}: RequestTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(
    null
  )

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingStatus(id)
    try {
      await onStatusChange(id, status)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '未対応'
      case 'reviewing':
        return '確認中'
      case 'approved':
        return '承認済み'
      case 'rejected':
        return '却下'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'
      case 'reviewing':
        return 'text-blue-600'
      case 'approved':
        return 'text-green-600'
      case 'rejected':
        return 'text-red-600'
      default:
        return ''
    }
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Twitter ID</TableHead>
              <TableHead className="text-right">希望価格</TableHead>
              <TableHead>連絡先</TableHead>
              <TableHead>申込日時</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  買取申込がありません
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.twitter_username}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{request.desired_price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      {request.contact_email && (
                        <div className="text-muted-foreground">
                          {request.contact_email}
                        </div>
                      )}
                      {request.contact_twitter && (
                        <div className="text-muted-foreground">
                          {request.contact_twitter}
                        </div>
                      )}
                      {request.contact_instagram && (
                        <div className="text-muted-foreground">
                          IG: {request.contact_instagram}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={request.status}
                      onValueChange={(value) =>
                        handleStatusChange(request.id, value)
                      }
                      disabled={updatingStatus === request.id}
                    >
                      <SelectTrigger
                        className={`w-[120px] ${getStatusColor(request.status)}`}
                      >
                        <SelectValue>
                          {getStatusLabel(request.status)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">未対応</SelectItem>
                        <SelectItem value="reviewing">確認中</SelectItem>
                        <SelectItem value="approved">承認済み</SelectItem>
                        <SelectItem value="rejected">却下</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>買取申込詳細</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && selectedRequest.id === request.id && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Twitter ID
                                </p>
                                <p className="text-lg font-medium">
                                  {selectedRequest.twitter_username}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  希望価格
                                </p>
                                <p className="text-lg font-medium">
                                  ¥{selectedRequest.desired_price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                連絡先
                              </p>
                              <div className="space-y-1">
                                {selectedRequest.contact_email && (
                                  <p>
                                    <span className="text-sm font-medium">
                                      Email:
                                    </span>{' '}
                                    {selectedRequest.contact_email}
                                  </p>
                                )}
                                {selectedRequest.contact_twitter && (
                                  <p>
                                    <span className="text-sm font-medium">
                                      Twitter:
                                    </span>{' '}
                                    {selectedRequest.contact_twitter}
                                  </p>
                                )}
                                {selectedRequest.contact_instagram && (
                                  <p>
                                    <span className="text-sm font-medium">
                                      Instagram:
                                    </span>{' '}
                                    {selectedRequest.contact_instagram}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                申込日時
                              </p>
                              <p>
                                {new Date(
                                  selectedRequest.created_at
                                ).toLocaleString('ja-JP')}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                ステータス
                              </p>
                              <p className={getStatusColor(selectedRequest.status)}>
                                {getStatusLabel(selectedRequest.status)}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
