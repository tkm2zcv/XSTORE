'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import type { Account } from '@/types'
import { getCategoryImage } from '@/lib/category-images'

interface AccountFormProps {
  account?: Account
  mode: 'create' | 'edit'
}

export function AccountForm({ account, mode }: AccountFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    username: account?.username || '',
    followers_count: account?.followers_count || 0,
    tweets_count: account?.tweets_count || 0,
    account_created_at: account?.account_created_at || '',
    price: account?.price || 0,
    category: account?.category || 'その他',
    description: account?.description || '',
    status: account?.status || 'available',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // バリデーション
      if (!formData.username) {
        setError('ユーザー名は必須です')
        setLoading(false)
        return
      }

      if (formData.price <= 0) {
        setError('価格は1円以上を入力してください')
        setLoading(false)
        return
      }

      const url =
        mode === 'create'
          ? '/api/accounts'
          : `/api/accounts/${account?.id}`

      const method = mode === 'create' ? 'POST' : 'PUT'

      // カテゴリーに基づいて画像URLを自動設定
      const image_url = getCategoryImage(formData.category)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_url,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '保存に失敗しました')
      }

      router.push('/admin/accounts')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">
                ユーザー名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="@から始まるTwitter ID"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                カテゴリー <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ビジネス">ビジネス</SelectItem>
                  <SelectItem value="エンタメ">エンタメ</SelectItem>
                  <SelectItem value="スポーツ">スポーツ</SelectItem>
                  <SelectItem value="ニュース">ニュース</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="followers_count">
                フォロワー数 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="followers_count"
                name="followers_count"
                type="number"
                min="0"
                value={formData.followers_count}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tweets_count">
                投稿数 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tweets_count"
                name="tweets_count"
                type="number"
                min="0"
                value={formData.tweets_count}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_created_at">アカウント作成日</Label>
              <Input
                id="account_created_at"
                name="account_created_at"
                type="date"
                value={formData.account_created_at}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              価格（円） <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="アカウントの詳細説明..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">ステータス</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">販売中</SelectItem>
                <SelectItem value="sold">売却済み</SelectItem>
                <SelectItem value="pending">保留中</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* プレビュー */}
      <Card>
        <CardHeader>
          <CardTitle>プレビュー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Image
              src={getCategoryImage(formData.category)}
              alt={formData.category}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-medium">@{formData.username || 'username'}</p>
              <p className="text-sm text-muted-foreground">
                {formData.category}
              </p>
              <p className="text-sm">
                フォロワー: {formData.followers_count.toLocaleString()} | 投稿:{' '}
                {formData.tweets_count.toLocaleString()}
              </p>
              <p className="font-bold text-lg">
                ¥{formData.price.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading
            ? '保存中...'
            : mode === 'create'
            ? '出品する'
            : '更新する'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}
