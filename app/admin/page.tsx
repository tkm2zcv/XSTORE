import { createAdminClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, MessageSquare, TrendingUp } from 'lucide-react'

// 30秒ごとに再検証（キャッシング）
export const revalidate = 30

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // 統計情報の取得（最適化：idのみ選択、headモード）
  const [
    { count: totalAccounts },
    { count: availableAccounts },
    { count: soldAccounts },
    { count: pendingRequests },
  ] = await Promise.all([
    supabase.from('accounts').select('id', { count: 'exact', head: true }),
    supabase
      .from('accounts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'available'),
    supabase
      .from('accounts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'sold'),
    supabase
      .from('purchase_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ])

  // 最近の買取申込（必要なカラムのみ選択）
  const { data: recentRequests } = await supabase
    .from('purchase_requests')
    .select('id, twitter_username, desired_price, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総アカウント数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">販売中</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableAccounts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">売却済み</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldAccounts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未対応の申込</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 最近の買取申込 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の買取申込</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRequests && recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{request.twitter_username}</p>
                    <p className="text-sm text-muted-foreground">
                      希望価格: ¥{request.desired_price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">まだ申込がありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
