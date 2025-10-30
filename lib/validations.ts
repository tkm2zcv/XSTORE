import { z } from 'zod'

// ============================================
// 共通バリデーション
// ============================================

/**
 * Twitter ID バリデーション
 * - @から始まる、または始まらない
 * - 英数字とアンダースコアのみ
 * - 1-15文字
 */
const twitterUsernameSchema = z
  .string()
  .min(1, 'Twitter IDを入力してください')
  .regex(
    /^@?[A-Za-z0-9_]{1,15}$/,
    'Twitter IDは英数字とアンダースコアのみ、1-15文字で入力してください'
  )
  .transform((val) => val.replace(/^@/, '')) // @ を削除

/**
 * メールアドレスバリデーション
 */
const emailSchema = z
  .string()
  .email('正しいメールアドレスを入力してください')

/**
 * URL バリデーション
 */
const urlSchema = z
  .string()
  .url('正しいURLを入力してください')
  .optional()

/**
 * 価格バリデーション
 */
const priceSchema = z
  .number()
  .int('価格は整数で入力してください')
  .min(1, '価格は1円以上で入力してください')
  .max(10000000, '価格は1000万円以下で入力してください')

/**
 * カテゴリバリデーション
 */
const categorySchema = z
  .enum(['ビジネス', 'エンタメ', 'スポーツ', 'ニュース', 'その他'])
  .optional()

// ============================================
// Account スキーマ
// ============================================

/**
 * アカウント作成スキーマ
 */
export const createAccountSchema = z.object({
  username: twitterUsernameSchema,
  followers_count: z
    .number()
    .int()
    .min(0, 'フォロワー数は0以上で入力してください'),
  tweets_count: z
    .number()
    .int()
    .min(0, 'ツイート数は0以上で入力してください'),
  account_created_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で入力してください')
    .optional(),
  price: priceSchema,
  category: categorySchema,
  description: z.string().max(1000, '説明は1000文字以内で入力してください').optional(),
  image_url: urlSchema,
})

/**
 * アカウント更新スキーマ
 */
export const updateAccountSchema = createAccountSchema
  .partial()
  .extend({
    status: z.enum(['available', 'sold', 'pending']).optional(),
  })

/**
 * アカウント検索スキーマ（クエリパラメータ）
 */
export const accountQuerySchema = z.object({
  category: categorySchema,
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().max(10000000).optional(),
  minFollowers: z.coerce.number().int().min(0).optional(),
  maxFollowers: z.coerce.number().int().optional(),
  status: z.enum(['available', 'sold', 'pending']).optional(),
  sortBy: z.enum(['price', 'followers_count', 'created_at']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(1000).optional().default(12),
})

// ============================================
// PurchaseRequest スキーマ
// ============================================

/**
 * 買取申込作成スキーマ
 */
export const createPurchaseRequestSchema = z
  .object({
    twitter_username: twitterUsernameSchema,
    desired_price: z
      .number({
        required_error: '希望価格は必須です',
        invalid_type_error: '数値を入力してください',
      })
      .int('価格は整数で入力してください')
      .min(1000, '1,000円以上を入力してください')
      .max(10000000, '価格が高すぎます（上限：10,000,000円）'),
    contact_email: emailSchema.optional().or(z.literal('')),
    contact_twitter: z.string().optional().or(z.literal('')),
    contact_instagram: z.string().optional().or(z.literal('')),
    message: z.string().max(1000, 'メッセージは1000文字以内で入力してください').optional().or(z.literal('')),
    has_image_tweet: z
      .boolean()
      .refine((val) => val === true, {
        message:
          'ハッシュタグやメンションなしの画像付きツイートがあることを確認してください',
      }),
  })
  .refine(
    (data) => data.contact_email || data.contact_twitter || data.contact_instagram,
    {
      message: '少なくとも1つの連絡先を入力してください',
      path: ['contact_email'],
    }
  )

// 既存の purchaseRequestSchema をエイリアスとして維持（互換性のため）
export const purchaseRequestSchema = createPurchaseRequestSchema

/**
 * 買取申込ステータス更新スキーマ
 */
export const updatePurchaseRequestSchema = z.object({
  status: z.enum(['pending', 'reviewing', 'approved', 'rejected'], {
    required_error: 'ステータスを選択してください',
  }),
})

/**
 * 買取申込検索スキーマ（クエリパラメータ）
 */
export const purchaseRequestQuerySchema = z.object({
  status: z.enum(['pending', 'reviewing', 'approved', 'rejected']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(['created_at', 'desired_price']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(1000).optional().default(20),
})

// ============================================
// Admin スキーマ
// ============================================

/**
 * ログインスキーマ
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
})

/**
 * 管理者作成スキーマ
 */
export const createAdminSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは英大文字、英小文字、数字を含む必要があります'
    ),
  name: z.string().min(1, '名前を入力してください').optional(),
})

// ============================================
// 型エクスポート
// ============================================

export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type AccountQuery = z.infer<typeof accountQuerySchema>
export type CreatePurchaseRequestInput = z.infer<typeof createPurchaseRequestSchema>
export type UpdatePurchaseRequestInput = z.infer<typeof updatePurchaseRequestSchema>
export type PurchaseRequestQuery = z.infer<typeof purchaseRequestQuerySchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateAdminInput = z.infer<typeof createAdminSchema>

// 既存の型をエイリアスとして維持（互換性のため）
export type PurchaseRequestFormData = CreatePurchaseRequestInput
