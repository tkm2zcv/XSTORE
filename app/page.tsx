/**
 * Home Page
 *
 * Landing page with hero section, features, and categories
 *
 * Performance:
 * - Static page with no data fetching
 * - Optimized for LCP (Largest Contentful Paint)
 * - Uses semantic HTML for SEO
 *
 * Accessibility:
 * - Proper heading hierarchy
 * - Descriptive button labels
 * - Keyboard navigable
 */

import Link from "next/link"
import { ArrowRight, Shield, Zap, HeadphonesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-12 md:py-24">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-primary">XSTORE</span>
              <br />
              Twitterアカウント買取・販売
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              安心・安全にTwitterアカウントの売買ができる
              <br className="hidden sm:inline" />
              プロフェッショナルなマーケットプレイス
            </p>
          </div>

          {/* CTA Blocks */}
          <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2">
            <Link href="/accounts" className="group">
              <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">
                    販売中アカウントを見る
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    豊富な取扱アカウントから選べる
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    詳しく見る
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/purchase" className="group">
              <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">
                    アカウント買取申込
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    あなたのアカウントを高価買取
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    申込する
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-8 sm:grid-cols-3 w-full max-w-2xl">
            <div>
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">取扱アカウント</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24h</div>
              <div className="text-sm text-muted-foreground">迅速対応</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">安心保証</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 bg-muted/40">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">サービスの特徴</h2>
          <p className="text-muted-foreground">なぜ多くの方に選ばれているのか</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-4" aria-hidden="true" />
              <CardTitle>安心・安全な取引</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                厳格な審査基準により、安全なアカウント売買をサポートします。
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" aria-hidden="true" />
              <CardTitle>迅速な対応</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                24時間以内のレスポンスで、スムーズな取引を実現します。
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30">
            <CardHeader>
              <HeadphonesIcon className="h-10 w-10 text-primary mb-4" aria-hidden="true" />
              <CardTitle>充実したサポート</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                専門スタッフが取引完了までしっかりサポートいたします。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-12 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">カテゴリ別</h2>
          <p className="text-muted-foreground">ジャンルから探す</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "ビジネス", count: 150 },
            { name: "エンタメ", count: 200 },
            { name: "スポーツ", count: 100 },
            { name: "ニュース", count: 80 },
            { name: "テクノロジー", count: 120 },
            { name: "その他", count: 350 },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/accounts?category=${encodeURIComponent(category.name)}`}
            >
              <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/50">
                <CardContent className="flex items-center justify-between p-6">
                  <span className="text-lg font-semibold">{category.name}</span>
                  <Badge variant="secondary">{category.count}件</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
