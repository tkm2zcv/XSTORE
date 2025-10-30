'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  purchaseRequestSchema,
  PurchaseRequestFormData,
} from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function PurchaseForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PurchaseRequestFormData>({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: {
      has_image_tweet: false,
    },
  })

  const onSubmit = async (data: PurchaseRequestFormData) => {
    setIsSubmitting(true)

    try {
      // モックデータ - 実際にはSupabaseに保存
      console.log('Purchase request data:', data)

      // 成功を装う
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: '送信完了',
        description: '買取申込を受け付けました。担当者よりご連絡いたします。',
      })

      router.push('/purchase/success')
    } catch (error) {
      toast({
        title: 'エラー',
        description: '送信に失敗しました。もう一度お試しください。',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Twitter ID */}
      <div className="space-y-2">
        <Label htmlFor="twitter_username">
          Twitter ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="twitter_username"
          placeholder="@username"
          {...register('twitter_username')}
          disabled={isSubmitting}
        />
        {errors.twitter_username && (
          <p className="text-sm text-destructive">
            {errors.twitter_username.message}
          </p>
        )}
      </div>

      {/* 希望価格 */}
      <div className="space-y-2">
        <Label htmlFor="desired_price">
          希望価格（円） <span className="text-destructive">*</span>
        </Label>
        <Input
          id="desired_price"
          type="number"
          placeholder="100000"
          {...register('desired_price', { valueAsNumber: true })}
          disabled={isSubmitting}
        />
        {errors.desired_price && (
          <p className="text-sm text-destructive">
            {errors.desired_price.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          ※ 買取価格は審査後に決定します。希望価格と異なる場合があります
        </p>
      </div>

      {/* 連絡先 */}
      <div className="space-y-4">
        <Label>
          連絡先（いずれか1つ以上必須）{' '}
          <span className="text-destructive">*</span>
        </Label>

        <div className="space-y-2">
          <Label htmlFor="contact_email" className="text-sm font-normal">
            メールアドレス
          </Label>
          <Input
            id="contact_email"
            type="email"
            placeholder="your@email.com"
            {...register('contact_email')}
            disabled={isSubmitting}
          />
          {errors.contact_email && (
            <p className="text-sm text-destructive">
              {errors.contact_email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_twitter" className="text-sm font-normal">
            Twitter ID
          </Label>
          <Input
            id="contact_twitter"
            placeholder="@your_twitter"
            {...register('contact_twitter')}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_instagram" className="text-sm font-normal">
            Instagram ID
          </Label>
          <Input
            id="contact_instagram"
            placeholder="@your_instagram"
            {...register('contact_instagram')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* メッセージ */}
      <div className="space-y-2">
        <Label htmlFor="message">メッセージ（任意）</Label>
        <Textarea
          id="message"
          placeholder="アカウントの特徴や補足情報などをご記入ください"
          rows={4}
          {...register('message')}
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          アカウントの特徴や買取に関するご質問などを自由にご記入ください
        </p>
      </div>

      {/* 画像付きツイート確認 */}
      <div className="space-y-2">
        <div className="flex items-start space-x-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <Controller
            name="has_image_tweet"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="has_image_tweet"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="has_image_tweet"
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ハッシュタグやメンションなしの画像付きツイートがあることを確認しました
            </Label>
            <p className="text-sm text-muted-foreground">
              買取には、ハッシュタグ（#）やメンション（@）が含まれていない画像付きツイートが必要です
            </p>
          </div>
        </div>
        {errors.has_image_tweet && (
          <p className="text-sm text-destructive">
            {errors.has_image_tweet.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        申込を送信
      </Button>
    </form>
  )
}
