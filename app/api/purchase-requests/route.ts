import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { validateRequestBody, validateQueryParams } from '@/lib/api-helpers'
import { handleSupabaseError, handleError } from '@/lib/error-handlers'
import { createPurchaseRequestSchema, purchaseRequestQuerySchema } from '@/lib/validations'
import { checkAuth } from '@/lib/auth-helpers'
import { rateLimit, getClientIdentifier, RateLimitPresets } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const url = new URL(request.url)

  try {
    // 認証チェック（管理者のみ）
    const authResult = await checkAuth(request)
    if (authResult instanceof NextResponse) {
      logger.api(request.method, url.pathname, { status: 401, duration: Date.now() - startTime, error: 'Unauthorized' })
      return authResult
    }

    // クエリパラメータのバリデーション
    const validationResult = validateQueryParams(request, purchaseRequestQuerySchema)
    if (validationResult instanceof NextResponse) {
      logger.api(request.method, url.pathname, { status: 400, duration: Date.now() - startTime, error: 'Validation failed' })
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
    // レート制限チェック（公開フォーム: 1時間に3リクエストまで）
    const identifier = getClientIdentifier(request)
    const rateLimitResult = rateLimit(identifier, RateLimitPresets.PUBLIC_FORM)

    if (!rateLimitResult.success) {
      const retryAfterSeconds = Math.ceil((rateLimitResult.reset - Date.now()) / 1000)

      logger.warn('Rate limit exceeded', {
        ip: identifier,
        endpoint: '/api/purchase-requests',
        retryAfter: retryAfterSeconds,
      })

      return NextResponse.json(
        {
          error: 'リクエストが多すぎます。しばらくしてから再度お試しください。',
          retryAfter: retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RateLimitPresets.PUBLIC_FORM.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
            'Retry-After': String(retryAfterSeconds),
          }
        }
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
      logger.db('INSERT', 'purchase_requests', { success: false, error: error.message })
      return handleSupabaseError(error)
    }

    const url = new URL(request.url)
    logger.db('INSERT', 'purchase_requests', { success: true, id: data.id })
    logger.api(request.method, url.pathname, { status: 201, duration: Date.now() - startTime, requestId: data.id })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    logger.error('Failed to create purchase request', error as Error, { ip })
    return handleError(error)
  }
}
