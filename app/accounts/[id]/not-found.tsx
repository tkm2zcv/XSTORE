import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-8">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">アカウントが見つかりません</h1>
          <p className="mb-6 text-muted-foreground">
            お探しのアカウントは存在しないか、既に売却済みです。
          </p>
          <Button asChild size="lg">
            <Link href="/accounts">販売中アカウント一覧へ</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
