# 実装ガイド

このドキュメントは、バックエンドアーキテクチャの実装を進めるための実践的なガイドです。

## 目次
1. [即座に対応すべき項目](#即座に対応すべき項目)
2. [認証の修正手順](#認証の修正手順)
3. [Rate Limitingの実装](#rate-limitingの実装)
4. [Loggingの実装](#loggingの実装)
5. [テスト方法](#テスト方法)
6. [トラブルシューティング](#トラブルシューティング)

---

## 即座に対応すべき項目

### 1. Middlewareとadmin layoutの有効化

以下のファイルが修正されました：

#### 修正済みファイル
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\middleware.ts` (新規作成)
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\app\admin\layout.tsx` (修正済み)

#### 必要な依存パッケージの確認

```bash
npm list next-auth
```

`next-auth/jwt`が利用可能か確認してください。

#### テスト手順

1. 開発サーバーを起動
```bash
npm run dev
```

2. ログアウト状態で `/admin` にアクセス
   - `/admin/login` にリダイレクトされるはず

3. ログインを試行
   - 正しい認証情報で `/admin` にアクセスできるはず

4. セッションが維持されるか確認
   - ブラウザをリフレッシュしてもログイン状態が保持されるはず

### 2. 古いバックアップファイルの削除

```bash
# バックアップファイルを削除（middlewareが正常動作を確認後）
rm middleware.ts.bak
```

---

## 認証の修正手順

### 現在の認証フロー

```
1. ユーザーが /admin/* にアクセス
   ↓
2. middleware.ts が実行
   ↓
3. getToken() でJWTトークンをチェック
   ↓
4a. トークンがない → /admin/login にリダイレクト
4b. トークンがある → 次のステップへ
   ↓
5. app/admin/layout.tsx が実行
   ↓
6. requireAuth() でセッション再確認
   ↓
7. セッションがない → /admin/login にリダイレクト
8. セッションがある → ページ表示
```

### トラブルシューティング: 無限リダイレクトループ

もし無限リダイレクトが発生する場合：

**症状**: `/admin/login` にアクセスしても再度 `/admin/login` にリダイレクトされる

**原因**: Middlewareのmatcher設定が `/admin/login` も保護している

**解決策**: `middleware.ts` の以下の部分を確認

```typescript
// 正しい設定
if (pathname === '/admin/login') {
  return NextResponse.next()  // ログインページは保護しない
}
```

### Next.js 15 との互換性確認

Next.js 15では一部のAPIが変更されています。以下を確認：

```typescript
// params は Promise<{ id: string }> になりました
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // await が必要
  // ...
}
```

現在のAPI Routeはすでに対応済みです。

---

## Rate Limitingの実装

### ステップ1: 基本実装（開発環境）

新しく作成された `lib/rate-limit.ts` を使用します。

#### API Routeへの適用例

```typescript
// app/api/purchase-requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  rateLimit,
  getClientIdentifier,
  RateLimitPresets
} from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request)
  const result = rateLimit(identifier, RateLimitPresets.PUBLIC_FORM)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'リクエストが多すぎます。しばらく待ってから再度お試しください。',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(RateLimitPresets.PUBLIC_FORM.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.reset),
          'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
        },
      }
    )
  }

  // 既存の処理を続行
  const validationResult = await validateRequestBody(request, createPurchaseRequestSchema)
  // ...
}
```

#### 推奨する適用箇所

| エンドポイント | プリセット | 理由 |
|--------------|----------|------|
| `POST /api/purchase-requests` | `PUBLIC_FORM` | スパム防止（3回/時間） |
| `POST /api/auth/signin` | `AUTH` | ブルートフォース攻撃防止 |
| `POST /api/accounts` | `STANDARD` | 通常のAPI制限 |
| `GET /api/accounts` | `RELAXED` | 読み取り専用は緩め |

### ステップ2: 本番環境への移行（推奨）

開発環境では`lib/rate-limit.ts`のインメモリストアで十分ですが、本番環境では分散システムに対応したソリューションを使用してください。

#### オプション1: Vercel KV + Upstash

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// lib/rate-limit-prod.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const publicFormLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
})

export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
})
```

#### オプション2: Redis

自前のRedisサーバーを使用する場合は`ioredis`を使用。

---

## Loggingの実装

### ステップ1: 基本的なログ記録

新しく作成された `lib/logger.ts` を使用します。

#### API Routeへの適用例

```typescript
// app/api/accounts/route.ts
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  logger.api('POST', '/api/accounts', { endpoint: 'create_account' })

  try {
    const authResult = await checkAuth(request)
    if (authResult instanceof NextResponse) {
      logger.warn('Unauthorized account creation attempt', {
        ip: request.headers.get('x-forwarded-for'),
      })
      return authResult
    }

    // バリデーション
    const validationResult = await validateRequestBody(request, createAccountSchema)
    if (validationResult instanceof NextResponse) {
      logger.warn('Validation failed for account creation', {
        ip: request.headers.get('x-forwarded-for'),
      })
      return validationResult
    }

    const { data: accountData } = validationResult
    const supabase = createServerClient()

    logger.db('INSERT', 'accounts', { username: accountData.username })

    const { data, error } = await supabase
      .from('accounts')
      .insert(accountData)
      .select()
      .single()

    if (error) {
      logger.error('Failed to create account', error as Error, {
        username: accountData.username,
      })
      return handleSupabaseError(error)
    }

    logger.info('Account created successfully', {
      accountId: data.id,
      username: data.username,
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    logger.error('Unexpected error in account creation', error as Error)
    return handleError(error)
  }
}
```

#### 認証イベントのログ記録

```typescript
// lib/auth.ts
import { logger } from '@/lib/logger'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logger.warn('Login attempt with missing credentials')
          return null
        }

        try {
          const supabase = createAdminClient()
          const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !admin) {
            logger.warn('Login attempt with invalid email', {
              email: credentials.email,
            })
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            admin.password_hash
          )

          if (!isValid) {
            logger.warn('Login attempt with invalid password', {
              email: credentials.email,
            })
            return null
          }

          // last_login_at を更新
          await supabase
            .from('admins')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', admin.id)

          logger.auth('login_success', {
            userId: admin.id,
            email: admin.email,
          })

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          }
        } catch (error) {
          logger.error('Auth error', error as Error, {
            email: credentials.email,
          })
          return null
        }
      },
    }),
  ],
  // ... rest of config
}
```

### ステップ2: パフォーマンスモニタリング

```typescript
import { PerformanceLogger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const perf = new PerformanceLogger('Fetch accounts with filters')

  try {
    const validationResult = validateQueryParams(request, accountQuerySchema)
    // ...処理...

    perf.end({ count: data.length, page: query.page })
    return NextResponse.json({ data, pagination })
  } catch (error) {
    perf.end({ error: true })
    throw error
  }
}
```

### ステップ3: 本番環境でのログ集約

#### Vercel Logs

Vercelでは自動的に`console.log/error`がキャプチャされます。

```bash
vercel logs [deployment-url]
```

#### 外部サービスとの統合（オプション）

**Sentry** (エラートラッキング):
```bash
npm install @sentry/nextjs
```

**Datadog** (APM):
```bash
npm install dd-trace
```

**LogRocket** (セッションリプレイ):
```bash
npm install logrocket
```

---

## テスト方法

### 1. 認証フローのテスト

#### 手動テスト

```bash
# 1. 開発サーバー起動
npm run dev

# 2. ブラウザで以下をテスト
# - http://localhost:3000/admin → /admin/login にリダイレクト
# - ログイン成功後 → /admin に遷移
# - ログアウト → 再度 /admin にアクセスできない
```

#### cURLでのテスト

```bash
# 1. ログインしてセッションCookieを取得
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt

# 2. セッションCookieを使ってAPIを呼び出し
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"username":"test_user","price":10000,...}'
```

### 2. Rate Limitingのテスト

#### スクリプトでテスト

```bash
# test-rate-limit.sh
for i in {1..5}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/purchase-requests \
    -H "Content-Type: application/json" \
    -d '{"twitter_username":"test","desired_price":10000,...}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done
```

期待される結果：
- 1-3回目: `201 Created`
- 4回目以降: `429 Too Many Requests`

### 3. ログのテスト

```typescript
// test-logger.ts
import { logger } from '@/lib/logger'

logger.debug('Debug message', { test: true })
logger.info('Info message', { userId: '123' })
logger.warn('Warning message', { count: 10 })
logger.error('Error message', new Error('Test error'), { context: 'test' })

logger.auth('test_login', { userId: '123' })
logger.api('GET', '/api/test', { query: 'example' })
logger.db('SELECT', 'accounts', { id: '123' })
```

実行：
```bash
npx tsx scripts/test-logger.ts
```

---

## トラブルシューティング

### 問題1: Middlewareが動作しない

**症状**: `/admin` にアクセスしてもリダイレクトされない

**確認事項**:
1. `middleware.ts` がプロジェクトルートに存在するか
2. `matcher` の設定が正しいか
3. `NEXTAUTH_SECRET` が設定されているか

```bash
# 環境変数の確認
cat .env.local | grep NEXTAUTH
```

**解決策**:
```bash
# Next.jsサーバーを再起動
npm run dev
```

### 問題2: 認証後にダッシュボードが表示されない

**症状**: ログイン成功後も `/admin/login` に留まる

**確認事項**:
1. NextAuth callbacksが正しく設定されているか
2. Cookieが正しく設定されているか

**デバッグ**:
```typescript
// lib/auth.ts - デバッグログを追加
callbacks: {
  async jwt({ token, user }) {
    console.log('JWT Callback:', { token, user })
    // ...
  },
  async session({ session, token }) {
    console.log('Session Callback:', { session, token })
    // ...
  },
}
```

### 問題3: Rate Limitが機能しない

**症状**: 何度リクエストしても `429` が返されない

**確認事項**:
1. Rate Limitコードが実際に呼び出されているか
2. 同じidentifierが使われているか

**デバッグ**:
```typescript
const identifier = getClientIdentifier(request)
console.log('Rate limit identifier:', identifier)
const result = rateLimit(identifier, config)
console.log('Rate limit result:', result)
```

### 問題4: ログが出力されない

**症状**: `logger.info()` を呼んでもコンソールに表示されない

**確認事項**:
1. 開発環境では `DEBUG` レベルも表示される
2. 本番環境では `INFO` 以上のみ表示される

**解決策**:
```typescript
// 強制的にログレベルを下げる（デバッグ用）
// lib/logger.ts
this.minLevel = LogLevel.DEBUG
```

### 問題5: Supabase接続エラー

**症状**: `Database error` が頻繁に発生

**確認事項**:
1. 環境変数が正しく設定されているか
2. Supabaseプロジェクトが起動しているか
3. RLSポリシーが正しく設定されているか

**デバッグ**:
```typescript
// lib/supabase.ts
export function createServerClient() {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  // パスワードは絶対にログに出力しない
  return createClient(supabaseUrl, supabaseAnonKey)
}
```

---

## Next Steps

1. **immediate**: middlewareとadmin layoutの動作確認
2. **short-term**: Rate limitingを公開フォームに適用
3. **mid-term**: ロギングを全APIエンドポイントに適用
4. **long-term**: 本番環境用のRate limiting（Upstash）とロギング（Sentry）を導入

---

## 関連ドキュメント

- [Backend Architecture](./backend-architecture.md) - アーキテクチャ全体像
- [Supabase Setup](../supabase/SETUP.md) - データベースセットアップ
- [Next.js Documentation](https://nextjs.org/docs) - Next.js公式ドキュメント
- [NextAuth.js Documentation](https://next-auth.js.org/) - NextAuth.js公式ドキュメント

---

**更新日**: 2024-10-28
**バージョン**: 1.0.0
