'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Edit, Trash2 } from 'lucide-react'
import type { Account } from '@/types'

interface AccountTableProps {
  accounts: Account[]
  onStatusChange: (id: string, status: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function AccountTable({
  accounts,
  onStatusChange,
  onDelete,
}: AccountTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingStatus(id)
    try {
      await onStatusChange(id, status)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await onDelete(deleteId)
    setDeleteId(null)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return '販売中'
      case 'sold':
        return '売却済み'
      case 'pending':
        return '保留中'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600'
      case 'sold':
        return 'text-gray-500'
      case 'pending':
        return 'text-yellow-600'
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
              <TableHead className="w-[100px]">画像</TableHead>
              <TableHead>ユーザー名</TableHead>
              <TableHead>カテゴリー</TableHead>
              <TableHead className="text-right">フォロワー</TableHead>
              <TableHead className="text-right">投稿数</TableHead>
              <TableHead className="text-right">価格</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  アカウントがありません
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <Image
                      src={account.image_url}
                      alt={account.username}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {account.username}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                      {account.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {account.followers_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {account.tweets_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{account.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={account.status}
                      onValueChange={(value) =>
                        handleStatusChange(account.id, value)
                      }
                      disabled={updatingStatus === account.id}
                    >
                      <SelectTrigger
                        className={`w-[120px] ${getStatusColor(account.status)}`}
                      >
                        <SelectValue>
                          {getStatusLabel(account.status)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">販売中</SelectItem>
                        <SelectItem value="sold">売却済み</SelectItem>
                        <SelectItem value="pending">保留中</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/accounts/${account.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(account.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アカウントを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。アカウントが完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
