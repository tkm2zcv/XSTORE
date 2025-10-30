import Image from 'next/image'
import { Account } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, MessageSquare, Calendar, ExternalLink, Wallet, Gift, Store, Bitcoin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface AccountDetailProps {
  account: Account
}

export function AccountDetail({ account }: AccountDetailProps) {
  // 環境変数からURL取得（未設定の場合は空文字列）
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || ''
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || ''

  // 問い合わせメッセージテンプレート
  const inquiryMessage = encodeURIComponent(
    `【アカウント購入問い合わせ】\nアカウント: ${account.display_name}\n価格: ¥${account.price.toLocaleString()}`
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      {/* メイン情報 */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-start gap-6">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full ring-4 ring-primary/10">
                <Image
                  src={account.image_url || '/placeholder-avatar.png'}
                  alt={account.display_name}
                  fill
                  sizes="96px"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold">{account.display_name}</h1>
                  <Badge variant="secondary">{account.category}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {account.followers_count.toLocaleString()} フォロワー
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{account.tweets_count.toLocaleString()} 投稿</span>
                  </div>
                  {account.account_created_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        作成: {new Date(account.account_created_date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="mb-4 text-lg font-semibold">アカウント説明</h2>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {account.bio || 'このアカウントの説明はありません。'}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">フォロワー</div>
                <div className="text-2xl font-bold">
                  {account.followers_count.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">投稿数</div>
                <div className="text-2xl font-bold">
                  {account.tweets_count.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">フォロー</div>
                <div className="text-2xl font-bold">
                  {account.following_count.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 販売価格（モバイル用） */}
        <Card className="lg:hidden">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="mb-2 text-sm text-muted-foreground">販売価格</div>
              <div className="text-4xl font-bold text-primary">
                ¥{account.price.toLocaleString()}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h3 className="font-semibold">購入のお問い合わせ</h3>
              <p className="text-sm text-muted-foreground">
                以下の方法でお問い合わせください
              </p>

              {lineUrl ? (
                <Button className="w-full" size="lg" asChild>
                  <a
                    href={`${lineUrl}?text=${inquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LINEで問い合わせ
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  LINEで問い合わせ（準備中）
                </Button>
              )}

              {twitterUrl ? (
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <a
                    href={`${twitterUrl}?text=${inquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitterで問い合わせ
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  disabled
                >
                  Twitterで問い合わせ（準備中）
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>ステータス</span>
                <Badge className="bg-green-500">販売中</Badge>
              </div>
              <div className="flex justify-between">
                <span>掲載日</span>
                <span className="font-medium text-foreground">
                  {new Date(account.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アカウントの特徴 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">このアカウントの特徴</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <span className="text-primary">✓</span>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">実績のあるアカウント</div>
                  <div className="text-xs text-muted-foreground">
                    {account.account_created_date &&
                      `${new Date(account.account_created_date).getFullYear()}年から運用`}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <span className="text-primary">✓</span>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">アクティブなフォロワー</div>
                  <div className="text-xs text-muted-foreground">
                    エンゲージメント率良好
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <span className="text-primary">✓</span>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">安全な引き継ぎ</div>
                  <div className="text-xs text-muted-foreground">
                    アカウント情報を完全移行
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <span className="text-primary">✓</span>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">即日対応可能</div>
                  <div className="text-xs text-muted-foreground">
                    お問い合わせから素早く対応
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 購入後のメリット */}
        <Card className="flex-1">
          <CardContent className="p-6 h-full flex flex-col">
            <h2 className="mb-4 text-lg font-semibold">購入後すぐに活用できます</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 flex-shrink-0">
                  <span className="text-xs text-green-600 dark:text-green-400">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  すでに育成済みのフォロワーベースで即座にビジネス開始
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 flex-shrink-0">
                  <span className="text-xs text-green-600 dark:text-green-400">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {account.category}分野での影響力を即座に獲得
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 flex-shrink-0">
                  <span className="text-xs text-green-600 dark:text-green-400">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  マーケティングやブランディングに活用可能
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 flex-shrink-0">
                  <span className="text-xs text-green-600 dark:text-green-400">4</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  アカウント育成にかかる時間とコストを大幅削減
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* サイドバー（購入情報） */}
      <div className="hidden lg:flex flex-col gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="mb-2 text-sm text-muted-foreground">販売価格</div>
              <div className="text-4xl font-bold text-primary">
                ¥{account.price.toLocaleString()}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h3 className="font-semibold">購入のお問い合わせ</h3>
              <p className="text-sm text-muted-foreground">
                以下の方法でお問い合わせください
              </p>

              {lineUrl ? (
                <Button className="w-full" size="lg" asChild>
                  <a
                    href={`${lineUrl}?text=${inquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LINEで問い合わせ
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  LINEで問い合わせ（準備中）
                </Button>
              )}

              {twitterUrl ? (
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <a
                    href={`${twitterUrl}?text=${inquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitterで問い合わせ
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  disabled
                >
                  Twitterで問い合わせ（準備中）
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>ステータス</span>
                <Badge className="bg-green-500">販売中</Badge>
              </div>
              <div className="flex justify-between">
                <span>掲載日</span>
                <span className="font-medium text-foreground">
                  {new Date(account.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 支払い方法 */}
        <Card className="flex-1">
          <CardContent className="p-6 h-full flex flex-col">
            <h3 className="mb-4 font-semibold">対応可能な支払い方法</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                  <Wallet className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="font-medium text-sm">PayPay</div>
                  <div className="text-xs text-muted-foreground">即時決済可能</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
                  <Gift className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="font-medium text-sm">Amazonギフト券</div>
                  <div className="text-xs text-muted-foreground">コード送信</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                  <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-sm">コンビニ支払い</div>
                  <div className="text-xs text-muted-foreground">各種コンビニ対応</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                  <Bitcoin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-sm">仮想通貨送金</div>
                  <div className="text-xs text-muted-foreground">BTC/ETH/USDT</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              ※ 詳細な支払い方法は問い合わせ時にご確認ください
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
