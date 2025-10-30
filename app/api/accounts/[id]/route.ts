import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { validateRequestBody } from '@/lib/api-helpers'
import { handleSupabaseError, handleError, createErrorResponse } from '@/lib/error-handlers'
import { updateAccountSchema } from '@/lib/validations'
import { checkAuth } from '@/lib/auth-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return createErrorResponse('アカウントが見つかりません', 404)
    }

    return NextResponse.json({ data })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 認証チェック
    const authResult = await checkAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params

    // リクエストボディのバリデーション
    const validationResult = await validateRequestBody(request, updateAccountSchema)
    if (validationResult instanceof NextResponse) {
      return validationResult
    }

    const { data: accountData } = validationResult
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return NextResponse.json({ data })
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 認証チェック
    const authResult = await checkAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params

    // リクエストボディのバリデーション（部分更新用に.partial()を使用）
    const validationResult = await validateRequestBody(
      request,
      updateAccountSchema.partial()
    )
    if (validationResult instanceof NextResponse) {
      return validationResult
    }

    const { data: accountData } = validationResult
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return NextResponse.json({ data })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 認証チェック
    const authResult = await checkAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)

    if (error) {
      return handleSupabaseError(error)
    }

    return NextResponse.json({ data: { id } })
  } catch (error) {
    return handleError(error)
  }
}
