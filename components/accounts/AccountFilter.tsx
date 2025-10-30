'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const categories = [
  'ビジネス',
  'エンタメ',
  'スポーツ',
  'ニュース',
  'テクノロジー',
  'その他',
]

interface AccountFilterProps {
  onFilterApplied?: () => void
  isMobile?: boolean
}

export function AccountFilter({ onFilterApplied, isMobile = false }: AccountFilterProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [minFollowers, setMinFollowers] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    // URLパラメータから初期値を設定
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minFollowersParam = searchParams.get('minFollowers')
    const categoryParam = searchParams.get('category')

    if (minPrice || maxPrice) {
      setPriceRange([
        parseInt(minPrice || '0'),
        parseInt(maxPrice || '1000000'),
      ])
    }
    if (minFollowersParam) {
      setMinFollowers(parseInt(minFollowersParam))
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())
    params.set('minFollowers', minFollowers.toString())
    if (selectedCategory) {
      params.set('category', selectedCategory)
    } else {
      params.delete('category')
    }
    params.set('page', '1') // フィルター適用時は1ページ目に戻す

    router.push(`/accounts?${params.toString()}`)
    onFilterApplied?.()
  }

  const resetFilters = () => {
    setPriceRange([0, 1000000])
    setMinFollowers(0)
    setSelectedCategory('')
    router.push('/accounts')
    onFilterApplied?.()
  }

  const filterContent = (
    <div className="space-y-6">
        {/* 価格帯 */}
        <div className="space-y-2">
          <Label>価格帯</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000000}
            step={10000}
            className="mt-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>¥{priceRange[0].toLocaleString()}</span>
            <span>¥{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* フォロワー数 */}
        <div className="space-y-2">
          <Label>最低フォロワー数</Label>
          <Slider
            value={[minFollowers]}
            onValueChange={(value) => setMinFollowers(value[0])}
            max={100000}
            step={1000}
            className="mt-2"
          />
          <div className="text-sm text-muted-foreground">
            {minFollowers.toLocaleString()}人以上
          </div>
        </div>

        {/* カテゴリ */}
        <div className="space-y-2">
          <Label>カテゴリ</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategory === category}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategory(category)
                    } else {
                      setSelectedCategory('')
                    }
                  }}
                />
                <label
                  htmlFor={category}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters} className="w-full">適用</Button>
        <Button variant="outline" onClick={resetFilters} className="w-full">
          リセット
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return filterContent
  }

  return (
    <Card className="h-fit sticky top-20">
      <CardHeader>
        <CardTitle>フィルター</CardTitle>
      </CardHeader>
      <CardContent>
        {filterContent}
      </CardContent>
    </Card>
  )
}
