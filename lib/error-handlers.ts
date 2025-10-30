import { NextResponse } from 'next/server'
import { PostgrestError } from '@supabase/supabase-js'

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
  console.error('Supabase error:', error)

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
  console.error('Unhandled error:', error)

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500)
  }

  return createErrorResponse('予期しないエラーが発生しました', 500)
}
