import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function PurchaseSuccessPage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-8">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">送信完了</CardTitle>
          <CardDescription>買取申込を受け付けました</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            担当者が内容を確認後、3営業日以内にご連絡させていただきます。
            今しばらくお待ちください。
          </p>

          <div className="rounded-lg bg-muted/40 p-4">
            <h4 className="mb-2 text-sm font-semibold">次のステップ</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• アカウントの審査を行います</li>
              <li>• 買取価格をご提示いたします</li>
              <li>• ご連絡先にメールまたはDMでご連絡</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full" size="lg" asChild>
              <Link href="/">トップページへ</Link>
            </Button>
            <Button className="w-full" variant="outline" size="lg" asChild>
              <Link href="/accounts">販売中アカウントを見る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
