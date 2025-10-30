import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Account } from '@/types'
import { Users, MessageSquare, Calendar } from 'lucide-react'

interface AccountCardProps {
  account: Account
  index?: number
}

export function AccountCard({ account, index = 99 }: AccountCardProps) {
  return (
    <Link href={`/accounts/${account.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/50 h-full">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10">
              <Image
                src={account.image_url || '/placeholder-avatar.png'}
                alt={account.display_name}
                fill
                sizes="64px"
                priority={index < 3}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{account.display_name}</h3>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">{account.category}</Badge>
              </div>
            </div>
          </div>

          {account.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {account.bio}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold">{account.followers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-semibold">{account.tweets_count.toLocaleString()}</span>
            </div>
          </div>

          {account.account_created_date && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>アカウント作成: {new Date(account.account_created_date).toLocaleDateString('ja-JP')}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-muted/40 p-6 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-bold text-primary">
              ¥{account.price.toLocaleString()}
            </div>
            {account.status === 'available' && (
              <Badge variant="default" className="bg-green-500">販売中</Badge>
            )}
            {account.status === 'pending' && (
              <Badge variant="secondary">審査中</Badge>
            )}
            {account.status === 'sold' && (
              <Badge variant="secondary" className="bg-gray-500">売却済</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
