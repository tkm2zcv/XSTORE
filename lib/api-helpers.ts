import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

/**
 * リクエストボディのバリデーション
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T } | NextResponse> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { data }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          details: formatZodError(error),
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

/**
 * クエリパラメータのバリデーション
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): { data: T } | NextResponse {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { data }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          details: formatZodError(error),
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 }
    )
  }
}

/**
 * Zod エラーをフォーマット
 */
function formatZodError(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    formatted[path] = err.message
  })
  return formatted
}
