import { Metadata } from 'next'
import { PurchaseForm } from '@/components/forms/PurchaseForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'アカウント買取申込 | XSTORE',
  description: 'Twitterアカウントの買取申込フォーム',
}

export default function PurchasePage() {
  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">アカウント買取申込</CardTitle>
          <CardDescription>
            以下のフォームに必要事項を入力してください。
            担当者が確認後、ご連絡させていただきます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseForm />
        </CardContent>
      </Card>

      <Card className="mt-8 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <CardContent className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span>ご注意事項</span>
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              •
              買取にはハッシュタグ（#）やメンション（@）が含まれていない画像付きツイートが必要です
            </li>
            <li>
              • 買取価格は審査後に決定します。希望価格と異なる場合があります
            </li>
            <li>• 申込後、3営業日以内にご連絡いたします</li>
            <li>• アカウント情報は厳重に管理いたします</li>
            <li>
              •
              アカウントのフォロワー数、投稿数、エンゲージメント率などを総合的に判断して買取価格を決定します
            </li>
            <li>
              •
              売却が成立した場合、アカウントの移行手続きについて詳しくご説明いたします
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-8 rounded-lg bg-muted/40 p-6">
        <h3 className="mb-4 font-semibold">買取の流れ</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </div>
            <div>
              <div className="font-medium">申込フォーム送信</div>
              <div className="text-sm text-muted-foreground">
                このフォームから必要事項を入力して送信
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </div>
            <div>
              <div className="font-medium">アカウント審査</div>
              <div className="text-sm text-muted-foreground">
                担当者がアカウントを審査し、買取価格を算定
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </div>
            <div>
              <div className="font-medium">価格のご提示</div>
              <div className="text-sm text-muted-foreground">
                買取価格と詳細をご連絡（3営業日以内）
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              4
            </div>
            <div>
              <div className="font-medium">契約・お支払い</div>
              <div className="text-sm text-muted-foreground">
                条件にご同意いただけましたら契約を締結し、お支払い手続きへ
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              5
            </div>
            <div>
              <div className="font-medium">アカウント移行</div>
              <div className="text-sm text-muted-foreground">
                安全にアカウント情報を移行し、取引完了
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
