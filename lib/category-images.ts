/**
 * カテゴリーごとの画像マッピング
 * カテゴリーを選択すると自動的に対応する画像が設定されます
 *
 * プレースホルダー画像を使用（本番環境では実際の画像に置き換えてください）
 */
export const categoryImages: Record<string, string> = {
  ビジネス: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
  エンタメ: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
  スポーツ: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
  ニュース: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop',
  その他: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
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
