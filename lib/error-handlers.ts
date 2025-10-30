import { NextResponse } from 'next/server'
import { PostgrestError } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

/**
 * エラーレスポンスの型
 */
interface ErrorResponse {
  error: string
  details?: Record<string, string>
  code?: string
}

/**
 * 統一的なエラーレスポンスを作成
 */
export function createErrorResponse(
  message: string,
  status: number,
  details?: Record<string, string>,
  code?: string
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
      ...(code && { code }),
    },
    { status }
  )
}

/**
 * Supabase エラーをハンドリング
 */
export function handleSupabaseError(error: PostgrestError): NextResponse {
  logger.error('Supabase database error', new Error(error.message), {
    code: error.code,
    details: error.details,
    hint: error.hint
  })

  // 共通エラーコードの処理
  switch (error.code) {
    case '23505': // unique_violation
      return createErrorResponse(
        'このデータは既に存在します',
        409,
        undefined,
        'DUPLICATE_ERROR'
      )
    case '23503': // foreign_key_violation
      return createErrorResponse(
        '関連するデータが見つかりません',
        400,
        undefined,
        'FOREIGN_KEY_ERROR'
      )
    case '23514': // check_violation
      return createErrorResponse(
        '入力データが制約に違反しています',
        400,
        undefined,
        'CHECK_VIOLATION'
      )
    case 'PGRST116': // not found
      return createErrorResponse(
        'データが見つかりません',
        404,
        undefined,
        'NOT_FOUND'
      )
    default:
      return createErrorResponse(
        'データベースエラーが発生しました',
        500,
        undefined,
        error.code
      )
  }
}

/**
 * 汎用エラーハンドラー
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof Error) {
    logger.error('Unhandled error in API route', error)
    return createErrorResponse(error.message, 500)
  }

  logger.error('Unknown error type', new Error(String(error)))
  return createErrorResponse('予期しないエラーが発生しました', 500)
}
