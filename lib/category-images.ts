/**
 * カテゴリーごとの画像マッピング
 * カテゴリーを選択すると自動的に対応する画像が設定されます
 */
export const categoryImages: Record<string, string> = {
  ビジネス: '/images/categories/business.jpg',
  エンタメ: '/images/categories/entertainment.jpg',
  スポーツ: '/images/categories/sports.jpg',
  ニュース: '/images/categories/news.jpg',
  その他: '/images/categories/default.jpg',
}

/**
 * カテゴリーから画像URLを取得
 */
export function getCategoryImage(category?: string | null): string {
  if (!category) {
    return categoryImages['その他']
  }
  return categoryImages[category] || categoryImages['その他']
}
