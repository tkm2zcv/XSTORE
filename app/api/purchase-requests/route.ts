import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { validateRequestBody, validateQueryParams } from '@/lib/api-helpers'
import { handleSupabaseError, handleError } from '@/lib/error-handlers'
import { createPurchaseRequestSchema, purchaseRequestQuerySchema } from '@/lib/validations'
import { checkAuth } from '@/lib/auth-helpers'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 認証チェック（管理者のみ）
    const authResult = await checkAuth(request)
    if (authResult instanceof NextResponse) {
      logger.api(request, 401, Date.now() - startTime, { error: 'Unauthorized' })
      return authResult
    }

    // クエリパラメータのバリデーション
    const validationResult = validateQueryParams(request, purchaseRequestQuerySchema)
    if (validationResult instanceof NextResponse) {
      logger.api(request, 400, Date.now() - startTime, { error: 'Validation failed' })
      return validationResult
    }

    const { data: query } = validationResult
    const supabase = createAdminClient()

    // クエリ構築
    let queryBuilder = supabase
      .from('purchase_requests')
      .select('*', { count: 'exact' })

    // フィルター適用
    if (query.status) queryBuilder = queryBuilder.eq('status', query.status)
    if (query.startDate) queryBuilder = queryBuilder.gte('created_at', query.startDate)
    if (query.endDate) queryBuilder = queryBuilder.lte('created_at', query.endDate)

    // ソート適用
    queryBuilder = queryBuilder.order(query.sortBy, { ascending: query.order === 'asc' })

    // ページネーション適用
    const from = (query.page - 1) * query.limit
    const to = from + query.limit - 1
    queryBuilder = queryBuilder.range(from, to)

    const { data, error, count } = await queryBuilder

    if (error) {
      return handleSupabaseError(error)
    }

    return NextResponse.json({
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / query.limit),
      },
    })
  } catch (error) {
    logger.error('Failed to fetch purchase requests', error as Error)
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

  try {
    // レート制限チェック（公開フォーム: 1分間に3リクエストまで）
    const rateLimitResult = await rateLimit.check(request, 'PUBLIC_FORM')
    if (!rateLimitResult.success) {
      logger.api(request, 429, Date.now() - startTime, {
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.retryAfter,
      })
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      )
    }

    // リクエストボディのバリデーション
    const validationResult = await validateRequestBody(request, createPurchaseRequestSchema)
    if (validationResult instanceof NextResponse) {
      logger.api(request, 400, Date.now() - startTime, { error: 'Validation failed' })
      return validationResult
    }

    const { data: requestData } = validationResult
    const supabase = createAdminClient()

    logger.info('Creating purchase request', {
      twitter_username: requestData.twitter_username,
      ip,
    })

    const { data, error } = await supabase
      .from('purchase_requests')
      .insert({
        twitter_username: requestData.twitter_username,
        desired_price: requestData.desired_price,
        contact_email: requestData.contact_email || null,
        contact_twitter: requestData.contact_twitter || null,
        contact_instagram: requestData.contact_instagram || null,
        message: requestData.message || null,
        has_image_tweet: requestData.has_image_tweet,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      logger.db('purchase_requests', 'INSERT', false, { error: error.message })
      return handleSupabaseError(error)
    }

    logger.db('purchase_requests', 'INSERT', true, { id: data.id })
    logger.api(request, 201, Date.now() - startTime, { requestId: data.id })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    logger.error('Failed to create purchase request', error as Error, { ip })
    return handleError(error)
  }
}
