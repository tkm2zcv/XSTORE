import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { validateRequestBody, validateQueryParams } from '@/lib/api-helpers'
import { handleSupabaseError, handleError } from '@/lib/error-handlers'
import { createAccountSchema, accountQuerySchema } from '@/lib/validations'
import { checkAuth } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータのバリデーション
    const validationResult = validateQueryParams(request, accountQuerySchema)
    if (validationResult instanceof NextResponse) {
      return validationResult
    }

    const { data: query } = validationResult
    const supabase = createAdminClient()

    // クエリ構築
    let queryBuilder = supabase
      .from('accounts')
      .select('*', { count: 'exact' })

    // フィルター適用
    if (query.status) queryBuilder = queryBuilder.eq('status', query.status)
    if (query.category) queryBuilder = queryBuilder.eq('category', query.category)
    if (query.minPrice) queryBuilder = queryBuilder.gte('price', query.minPrice)
    if (query.maxPrice) queryBuilder = queryBuilder.lte('price', query.maxPrice)
    if (query.minFollowers) queryBuilder = queryBuilder.gte('followers_count', query.minFollowers)
    if (query.maxFollowers) queryBuilder = queryBuilder.lte('followers_count', query.maxFollowers)

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
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await checkAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // リクエストボディのバリデーション
    const validationResult = await validateRequestBody(request, createAccountSchema)
    if (validationResult instanceof NextResponse) {
      return validationResult
    }

    const { data: accountData } = validationResult
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('accounts')
      .insert(accountData)
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
