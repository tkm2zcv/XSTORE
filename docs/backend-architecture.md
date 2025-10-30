# バックエンドアーキテクチャ

## 目次
1. [概要](#概要)
2. [技術スタック](#技術スタック)
3. [アーキテクチャ全体像](#アーキテクチャ全体像)
4. [データベース設計](#データベース設計)
5. [API設計](#api設計)
6. [認証・認可フロー](#認証認可フロー)
7. [データフロー](#データフロー)
8. [ファイル構造](#ファイル構造)
9. [セキュリティ対策](#セキュリティ対策)
10. [エラーハンドリング](#エラーハンドリング)
11. [ベストプラクティス](#ベストプラクティス)
12. [改善提案](#改善提案)

---

## 概要

Twitterアカウント買取販売サイトのバックエンドは、Next.js 15のApp Routerを使用したサーバーレスアーキテクチャです。Supabase（PostgreSQL）をデータベースとして使用し、NextAuth.jsで認証を管理します。

### 主な特徴
- **サーバーレス**: Next.js API Routesを使用
- **型安全**: TypeScriptで完全に型付け
- **バリデーション**: Zodによる厳密なバリデーション
- **認証**: NextAuth.js（JWT戦略）
- **データベース**: Supabase PostgreSQL

---

## 技術スタック

### フロントエンド・フレームワーク
- **Next.js 15** (App Router)
- **TypeScript 5.x**
- **React 18**

### バックエンド・データベース
- **Supabase** (PostgreSQL 15)
- **Supabase JS Client** (v2)
- **NextAuth.js** (v4)

### バリデーション・セキュリティ
- **Zod** - スキーマバリデーション
- **bcryptjs** - パスワードハッシュ化

### デプロイ
- **Vercel** (推奨)
- **Supabase Cloud**

---

## アーキテクチャ全体像

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│                     Next.js 15 App Router                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Next.js Server                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Server Components                            │ │
│  │  - データフェッチング                                     │ │
│  │  - SEO最適化                                              │ │
│  │  - Server-side Rendering                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              API Routes                                   │ │
│  │  - /api/accounts                                          │ │
│  │  - /api/accounts/[id]                                     │ │
│  │  - /api/purchase-requests                                 │ │
│  │  - /api/purchase-requests/[id]                            │ │
│  │  - /api/auth/[...nextauth]                                │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Middleware Layer                             │ │
│  │  - 認証チェック (Next.js Middleware)                      │ │
│  │  - リクエストバリデーション (Zod)                         │ │
│  │  - エラーハンドリング                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Supabase Client
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Supabase                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                          │ │
│  │  - accounts                                               │ │
│  │  - purchase_requests                                      │ │
│  │  - admins                                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Row Level Security (RLS)                     │ │
│  │  - 公開データのアクセス制御                               │ │
│  │  - 認証済みユーザーのアクセス制御                         │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### コンポーネント間の通信フロー

```
Client → Server Component → Supabase (データ取得)
Client → API Route → Validation → Supabase → Response
Client → NextAuth → Credentials Provider → Supabase → JWT Token
```

---

## データベース設計

### ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────┐
│                          accounts                           │
├─────────────────────────────────────────────────────────────┤
│ id                    UUID         PK                       │
│ username              VARCHAR(255) NOT NULL                 │
│ display_name          VARCHAR(255)                          │
│ followers_count       INTEGER      NOT NULL, >= 0           │
│ following_count       INTEGER      DEFAULT 0, >= 0          │
│ tweets_count          INTEGER      NOT NULL, >= 0           │
│ account_created_date  DATE                                  │
│ price                 INTEGER      NOT NULL, >= 0           │
│ category              VARCHAR(100)                          │
│ description           TEXT                                  │
│ status                VARCHAR(50)  DEFAULT 'available'      │
│                                    CHECK: available|sold|   │
│                                          pending            │
│ image_url             TEXT                                  │
│ created_at            TIMESTAMPTZ  DEFAULT NOW()            │
│ updated_at            TIMESTAMPTZ  DEFAULT NOW()            │
└─────────────────────────────────────────────────────────────┘
      Indexes:
      - idx_accounts_status
      - idx_accounts_category
      - idx_accounts_price
      - idx_accounts_followers
      - idx_accounts_created_at

┌─────────────────────────────────────────────────────────────┐
│                    purchase_requests                        │
├─────────────────────────────────────────────────────────────┤
│ id                    UUID         PK                       │
│ twitter_username      VARCHAR(255) NOT NULL                 │
│ desired_price         INTEGER      NOT NULL, >= 0           │
│ contact_email         VARCHAR(255)                          │
│ contact_twitter       VARCHAR(255)                          │
│ contact_instagram     VARCHAR(255)                          │
│ message               TEXT                                  │
│ has_image_tweet       BOOLEAN      DEFAULT false            │
│ status                VARCHAR(50)  DEFAULT 'pending'        │
│                                    CHECK: pending|reviewing │
│                                          |approved|rejected │
│ created_at            TIMESTAMPTZ  DEFAULT NOW()            │
├─────────────────────────────────────────────────────────────┤
│ CONSTRAINT at_least_one_contact:                            │
│   contact_email IS NOT NULL OR                              │
│   contact_twitter IS NOT NULL OR                            │
│   contact_instagram IS NOT NULL                             │
└─────────────────────────────────────────────────────────────┘
      Indexes:
      - idx_purchase_requests_status
      - idx_purchase_requests_created_at
      - idx_purchase_requests_username

┌─────────────────────────────────────────────────────────────┐
│                          admins                             │
├─────────────────────────────────────────────────────────────┤
│ id                    UUID         PK                       │
│ email                 VARCHAR(255) UNIQUE, NOT NULL         │
│ password_hash         TEXT         NOT NULL                 │
│ name                  VARCHAR(255)                          │
│ created_at            TIMESTAMPTZ  DEFAULT NOW()            │
│ last_login_at         TIMESTAMPTZ                           │
├─────────────────────────────────────────────────────────────┤
│ CONSTRAINT valid_email:                                     │
│   email matches email format regex                          │
└─────────────────────────────────────────────────────────────┘
```

### データベース制約

#### accounts テーブル
- **CHECK制約**:
  - `followers_count >= 0`
  - `following_count >= 0`
  - `tweets_count >= 0`
  - `price >= 0`
  - `status IN ('available', 'sold', 'pending')`
- **トリガー**: `updated_at`自動更新

#### purchase_requests テーブル
- **CHECK制約**:
  - `desired_price >= 0`
  - `status IN ('pending', 'reviewing', 'approved', 'rejected')`
  - 少なくとも1つの連絡先（email/twitter/instagram）が必須

#### admins テーブル
- **UNIQUE制約**: `email`
- **CHECK制約**: メールアドレス形式バリデーション

### インデックス戦略

#### パフォーマンス最適化のためのインデックス

1. **accounts テーブル**:
   - `idx_accounts_status`: ステータスによるフィルタリング（一覧表示）
   - `idx_accounts_category`: カテゴリフィルター
   - `idx_accounts_price`: 価格範囲検索
   - `idx_accounts_followers`: フォロワー数ソート
   - `idx_accounts_created_at`: 新着順ソート（DESC）

2. **purchase_requests テーブル**:
   - `idx_purchase_requests_status`: ステータスフィルター
   - `idx_purchase_requests_created_at`: 時系列ソート（DESC）
   - `idx_purchase_requests_username`: ユーザー名検索

### Row Level Security (RLS)

**重要**: 現在の実装ではRLSは有効ですが、サーバーサイドで認証を管理しているため、主にService Role Keyを使用しています。

#### accounts テーブルのポリシー
- **SELECT**: 誰でも`status='available'`のアカウントを閲覧可能
- **SELECT (authenticated)**: 認証済みユーザーは全アカウント閲覧可能
- **INSERT/UPDATE/DELETE**: 認証済みユーザーのみ

#### purchase_requests テーブルのポリシー
- **INSERT**: 誰でも申込作成可能（公開フォーム）
- **SELECT/UPDATE/DELETE**: 認証済みユーザーのみ

#### admins テーブルのポリシー
- **ALL**: 認証済みユーザーのみ

---

## API設計

### RESTful API エンドポイント

#### 認証
- `POST /api/auth/signin` - ログイン
- `POST /api/auth/signout` - ログアウト
- `GET /api/auth/session` - セッション取得

#### アカウント管理

##### GET /api/accounts
販売中のアカウント一覧を取得

**クエリパラメータ**:
```typescript
{
  category?: 'ビジネス' | 'エンタメ' | 'スポーツ' | 'ニュース' | 'その他'
  minPrice?: number        // 最小価格
  maxPrice?: number        // 最大価格
  minFollowers?: number    // 最小フォロワー数
  maxFollowers?: number    // 最大フォロワー数
  status?: 'available' | 'sold' | 'pending'
  sortBy?: 'price' | 'followers_count' | 'created_at'  // デフォルト: created_at
  order?: 'asc' | 'desc'   // デフォルト: desc
  page?: number            // デフォルト: 1
  limit?: number           // デフォルト: 12, 最大: 100
}
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "example_user",
      "followers_count": 10000,
      "tweets_count": 5000,
      "account_created_date": "2020-01-01",
      "price": 50000,
      "category": "ビジネス",
      "description": "アカウント説明",
      "status": "available",
      "image_url": "https://...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

##### POST /api/accounts
新規アカウント出品（認証必須）

**リクエストボディ**:
```json
{
  "username": "example_user",
  "followers_count": 10000,
  "tweets_count": 5000,
  "account_created_at": "2020-01-01",
  "price": 50000,
  "category": "ビジネス",
  "description": "アカウント説明",
  "image_url": "https://..."
}
```

**レスポンス**: `201 Created`
```json
{
  "data": { /* Account object */ }
}
```

##### GET /api/accounts/[id]
アカウント詳細を取得

**レスポンス**: `200 OK`
```json
{
  "data": { /* Account object */ }
}
```

##### PUT /api/accounts/[id]
アカウント情報を更新（認証必須）

**リクエストボディ**:
```json
{
  "price": 45000,
  "status": "sold"
  // 部分更新可能
}
```

**レスポンス**: `200 OK`

##### PATCH /api/accounts/[id]
アカウント情報を部分更新（認証必須）

**リクエストボディ**: 任意のフィールド

**レスポンス**: `200 OK`

##### DELETE /api/accounts/[id]
アカウントを削除（認証必須）

**レスポンス**: `200 OK`
```json
{
  "data": { "id": "uuid" }
}
```

#### 買取申込管理

##### GET /api/purchase-requests
買取申込一覧を取得（認証必須）

**クエリパラメータ**:
```typescript
{
  status?: 'pending' | 'reviewing' | 'approved' | 'rejected'
  startDate?: string     // ISO 8601形式
  endDate?: string       // ISO 8601形式
  sortBy?: 'created_at' | 'desired_price'  // デフォルト: created_at
  order?: 'asc' | 'desc' // デフォルト: desc
  page?: number          // デフォルト: 1
  limit?: number         // デフォルト: 20, 最大: 100
}
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "uuid",
      "twitter_username": "example_user",
      "desired_price": 30000,
      "contact_email": "user@example.com",
      "contact_twitter": "@contact_user",
      "contact_instagram": "@contact_user",
      "message": "メッセージ",
      "has_image_tweet": true,
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

##### POST /api/purchase-requests
買取申込を作成（認証不要）

**リクエストボディ**:
```json
{
  "twitter_username": "example_user",
  "desired_price": 30000,
  "contact_email": "user@example.com",
  "contact_twitter": "@contact_user",
  "contact_instagram": "@contact_user",
  "message": "アカウントについての説明",
  "has_image_tweet": true
}
```

**バリデーションルール**:
- `twitter_username`: 必須、1-15文字、英数字とアンダースコアのみ
- `desired_price`: 必須、1,000円以上、10,000,000円以下
- 連絡先: 少なくとも1つ（email/twitter/instagram）が必須
- `has_image_tweet`: 必須、trueでなければエラー
- `message`: オプション、最大1000文字

**レスポンス**: `201 Created`

##### GET /api/purchase-requests/[id]
買取申込詳細を取得（認証必須）

**レスポンス**: `200 OK`

##### PATCH /api/purchase-requests/[id]
買取申込を更新（認証必須）

**リクエストボディ**:
```json
{
  "status": "approved"
}
```

**レスポンス**: `200 OK`

##### DELETE /api/purchase-requests/[id]
買取申込を削除（認証必須）

**レスポンス**: `200 OK`

### APIエラーレスポンス標準形式

すべてのエラーレスポンスは以下の形式に統一されています：

```json
{
  "error": "エラーメッセージ",
  "details": {
    "field_name": "フィールド固有のエラーメッセージ"
  },
  "code": "ERROR_CODE"
}
```

#### 共通HTTPステータスコード

- `200 OK` - 成功
- `201 Created` - リソース作成成功
- `400 Bad Request` - バリデーションエラー
- `401 Unauthorized` - 認証エラー
- `403 Forbidden` - 権限エラー
- `404 Not Found` - リソースが見つからない
- `409 Conflict` - 重複エラー
- `500 Internal Server Error` - サーバーエラー

#### Supabaseエラーコードマッピング

| Supabase Code | HTTP Status | Message |
|---------------|-------------|---------|
| 23505 | 409 | このデータは既に存在します |
| 23503 | 400 | 関連するデータが見つかりません |
| 23514 | 400 | 入力データが制約に違反しています |
| PGRST116 | 404 | データが見つかりません |

---

## 認証・認可フロー

### NextAuth.js 認証フロー

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. POST /api/auth/signin
       │    { email, password }
       ▼
┌──────────────────────────────────────────────────────────┐
│               NextAuth Credentials Provider              │
├──────────────────────────────────────────────────────────┤
│  2. authorize(credentials)                               │
│     ├─ メールアドレスでadminsテーブル検索                │
│     ├─ bcrypt.compare(password, password_hash)           │
│     ├─ パスワード検証成功                                │
│     └─ last_login_at を更新                              │
│                                                           │
│  3. JWT callback                                         │
│     ├─ トークンにユーザー情報を埋め込む                  │
│     └─ { id, email, name }                               │
│                                                           │
│  4. Session callback                                     │
│     └─ JWTトークンからセッションオブジェクト生成         │
└──────────────────────────────────────────────────────────┘
       │
       │ 5. Set-Cookie: next-auth.session-token
       ▼
┌──────────────┐
│   Client     │ ← JWT Token (HttpOnly Cookie)
└──────────────┘
```

### セッション管理

- **戦略**: JWT (JSON Web Token)
- **有効期限**: 30日間
- **保存場所**: HttpOnly Cookie
- **更新**: 自動（アクティブな間）

### 認証保護の実装

#### 1. Next.js Middleware（現在無効化中）

`middleware.ts.bak`:
```typescript
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/admin/login',
  },
})

export const config = {
  matcher: [
    '/admin/((?!login).*)',  // /admin/login以外のすべて
    '/api/admin/:path*',
  ],
}
```

**問題点**:
- Next.js 15との互換性問題
- 一時的に無効化されている

#### 2. API Route レベルの認証

すべての保護されたAPI Routeで`checkAuth`を使用：

```typescript
// lib/auth-helpers.ts
export async function checkAuth(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return { session }
}

// API Routeでの使用例
export async function POST(request: NextRequest) {
  const authResult = await checkAuth(request)
  if (authResult instanceof NextResponse) {
    return authResult  // 認証エラーレスポンスを返す
  }
  // 認証済み処理を続行
}
```

#### 3. Server Component レベルの認証

```typescript
// lib/auth-helpers.ts
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

// Server Componentでの使用例
export default async function AdminPage() {
  const session = await requireAuth()
  // 認証済みユーザーのみアクセス可能
}
```

**現状の問題**:
- `app/admin/layout.tsx`で一時的に認証チェックがコメントアウトされている
- UIプレビューのためにダミーセッションを使用

### 認証フロー図

```
┌─────────────────────────────────────────────────────────────────┐
│                        認証フロー                               │
└─────────────────────────────────────────────────────────────────┘

未認証ユーザー:
  /admin/* にアクセス
    → Middleware（理想）または Layout（現状）で認証チェック
    → 未認証の場合 → /admin/login にリダイレクト

ログイン:
  /admin/login
    → POST /api/auth/signin { email, password }
    → NextAuth Credentials Provider
    → Supabase admins テーブル検証
    → JWTトークン発行（Cookie）
    → /admin にリダイレクト

認証済みユーザー:
  /admin/* にアクセス
    → セッション有効性チェック
    → 成功 → ページ表示

API呼び出し:
  POST /api/accounts
    → checkAuth(request)
    → getServerSession(authOptions)
    → セッションがない場合 → 401 Unauthorized
    → セッションがある場合 → 処理続行
```

---

## データフロー

### 公開ページ（アカウント一覧）のデータフロー

```
┌──────────────┐
│   Client     │
│ /accounts    │
└──────┬───────┘
       │
       │ 1. ページリクエスト
       ▼
┌─────────────────────────────────────────────┐
│       Server Component (SSR)                │
│  app/accounts/page.tsx                      │
├─────────────────────────────────────────────┤
│  2. データフェッチ                          │
│     const accounts = await getAccounts()    │
└──────────────┬──────────────────────────────┘
               │
               │ 3. Supabase Client
               ▼
┌─────────────────────────────────────────────┐
│         Supabase PostgreSQL                 │
│  SELECT * FROM accounts                     │
│  WHERE status = 'available'                 │
│  ORDER BY created_at DESC                   │
└──────────────┬──────────────────────────────┘
               │
               │ 4. データ返却
               ▼
┌─────────────────────────────────────────────┐
│       Server Component                      │
│  HTML生成（SSR）                            │
└──────────────┬──────────────────────────────┘
               │
               │ 5. HTMLレスポンス
               ▼
┌──────────────┐
│   Client     │ ← 完全レンダリング済みHTML
└──────────────┘
```

### 管理画面（アカウント作成）のデータフロー

```
┌──────────────┐
│   Client     │
│ /admin/      │
│  accounts/   │
│  new         │
└──────┬───────┘
       │
       │ 1. フォーム送信
       │    POST { username, price, ... }
       ▼
┌─────────────────────────────────────────────┐
│       Client Component                      │
│  components/admin/AccountForm.tsx           │
├─────────────────────────────────────────────┤
│  2. バリデーション（クライアント側）        │
│     createAccountSchema.parse(data)         │
└──────────────┬──────────────────────────────┘
               │
               │ 3. API呼び出し
               │    fetch('/api/accounts', { method: 'POST' })
               ▼
┌─────────────────────────────────────────────┐
│       API Route                             │
│  app/api/accounts/route.ts                  │
├─────────────────────────────────────────────┤
│  4. 認証チェック                            │
│     await checkAuth(request)                │
│                                             │
│  5. バリデーション（サーバー側）            │
│     validateRequestBody(req, schema)        │
│                                             │
│  6. Supabase Insert                         │
│     supabase.from('accounts').insert(data)  │
└──────────────┬──────────────────────────────┘
               │
               │ 7. INSERT INTO accounts
               ▼
┌─────────────────────────────────────────────┐
│         Supabase PostgreSQL                 │
│  - 制約チェック                             │
│  - インデックス更新                         │
│  - トリガー実行（updated_at）               │
└──────────────┬──────────────────────────────┘
               │
               │ 8. データ返却
               ▼
┌─────────────────────────────────────────────┐
│       API Route                             │
│  201 Created                                │
│  { data: { id, username, ... } }            │
└──────────────┬──────────────────────────────┘
               │
               │ 9. JSONレスポンス
               ▼
┌──────────────┐
│   Client     │ ← 成功メッセージ表示
│              │   ページ遷移
└──────────────┘
```

### 買取申込フォームのデータフロー

```
┌──────────────┐
│   Client     │
│ /purchase    │
└──────┬───────┘
       │
       │ 1. フォーム送信（認証不要）
       ▼
┌─────────────────────────────────────────────┐
│       Client Component                      │
│  components/forms/PurchaseForm.tsx          │
├─────────────────────────────────────────────┤
│  2. Zodバリデーション                       │
│     - twitter_username                      │
│     - desired_price (>= 1000円)             │
│     - 連絡先1つ以上                         │
│     - has_image_tweet = true                │
└──────────────┬──────────────────────────────┘
               │
               │ 3. POST /api/purchase-requests
               ▼
┌─────────────────────────────────────────────┐
│       API Route（認証不要）                 │
│  app/api/purchase-requests/route.ts         │
├─────────────────────────────────────────────┤
│  4. バリデーション                          │
│     validateRequestBody(req, schema)        │
│                                             │
│  5. Supabase Insert                         │
│     status = 'pending'                      │
└──────────────┬──────────────────────────────┘
               │
               │ 6. INSERT INTO purchase_requests
               ▼
┌─────────────────────────────────────────────┐
│         Supabase PostgreSQL                 │
│  - 制約チェック（at_least_one_contact）     │
└──────────────┬──────────────────────────────┘
               │
               │ 7. 201 Created
               ▼
┌──────────────┐
│   Client     │ ← 申込完了メッセージ
└──────────────┘
```

---

## ファイル構造

```
C:/Users/takuma/マイドライブ/PC/kiwamero coding/twi-kaitori/
│
├── app/                              # Next.js App Router
│   ├── (public)/                     # 公開ページグループ
│   │   ├── page.tsx                  # トップページ
│   │   ├── accounts/
│   │   │   ├── page.tsx              # アカウント一覧
│   │   │   └── [id]/
│   │   │       └── page.tsx          # アカウント詳細
│   │   ├── purchase/
│   │   │   └── page.tsx              # 買取申込フォーム
│   │   ├── terms/
│   │   │   └── page.tsx              # 利用規約
│   │   └── privacy/
│   │       └── page.tsx              # プライバシーポリシー
│   │
│   ├── admin/                        # 管理画面（認証必須）
│   │   ├── layout.tsx                # 管理画面レイアウト
│   │   │                             # ⚠️ 現在認証チェックが無効化
│   │   ├── page.tsx                  # ダッシュボード
│   │   ├── login/
│   │   │   └── page.tsx              # 管理者ログイン
│   │   ├── accounts/
│   │   │   ├── page.tsx              # アカウント一覧
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # 新規アカウント出品
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx      # アカウント編集
│   │   └── requests/
│   │       └── page.tsx              # 買取申込一覧
│   │
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth.js ハンドラー
│   │   ├── accounts/
│   │   │   ├── route.ts              # GET (一覧), POST (作成)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, PATCH, DELETE
│   │   └── purchase-requests/
│   │       ├── route.ts              # GET (一覧), POST (作成)
│   │       └── [id]/
│   │           └── route.ts          # GET, PATCH, DELETE
│   │
│   ├── layout.tsx                    # ルートレイアウト
│   └── providers.tsx                 # Context Providers
│
├── components/                       # Reactコンポーネント
│   ├── ui/                           # Shadcn/ui コンポーネント
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── accounts/
│   │   ├── AccountCard.tsx
│   │   ├── AccountList.tsx
│   │   └── AccountFilter.tsx
│   ├── forms/
│   │   └── PurchaseForm.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       ├── AccountForm.tsx
│       └── RequestTable.tsx
│
├── lib/                              # ユーティリティ・設定
│   ├── supabase.ts                   # Supabaseクライアント設定
│   │   ├─ supabase (anon key)        # クライアント側
│   │   ├─ createServerClient()       # サーバー側（RLS尊重）
│   │   └─ createAdminClient()        # 管理者用（RLSバイパス）
│   │
│   ├── auth.ts                       # NextAuth設定
│   │   └─ authOptions                # Credentials Provider設定
│   │
│   ├── auth-helpers.ts               # 認証ヘルパー関数
│   │   ├─ getSession()               # セッション取得
│   │   ├─ requireAuth()              # Server Component認証
│   │   └─ checkAuth()                # API Route認証
│   │
│   ├── validations.ts                # Zodバリデーションスキーマ
│   │   ├─ createAccountSchema
│   │   ├─ updateAccountSchema
│   │   ├─ accountQuerySchema
│   │   ├─ createPurchaseRequestSchema
│   │   ├─ updatePurchaseRequestSchema
│   │   ├─ purchaseRequestQuerySchema
│   │   └─ loginSchema
│   │
│   ├── api-helpers.ts                # APIヘルパー関数
│   │   ├─ validateRequestBody()      # リクエストボディ検証
│   │   └─ validateQueryParams()      # クエリパラメータ検証
│   │
│   ├── error-handlers.ts             # エラーハンドリング
│   │   ├─ createErrorResponse()      # 統一エラーレスポンス
│   │   ├─ handleSupabaseError()      # Supabaseエラー処理
│   │   └─ handleError()              # 汎用エラー処理
│   │
│   └── utils.ts                      # その他ユーティリティ
│
├── types/                            # TypeScript型定義
│   └── index.ts                      # データベースモデル型
│       ├─ Account
│       ├─ PurchaseRequest
│       └─ Admin
│
├── hooks/                            # カスタムReact Hooks
│   ├── useTheme.ts
│   └── useAccounts.ts
│
├── supabase/                         # Supabaseスキーマ
│   ├── schema.sql                    # データベーススキーマ定義
│   ├── SETUP.md                      # セットアップ手順
│   └── README.md                     # Supabase設定ドキュメント
│
├── scripts/                          # ユーティリティスクリプト
│   └── create-admin.ts               # 管理者作成スクリプト
│
├── docs/                             # ドキュメント
│   └── backend-architecture.md       # このドキュメント
│
├── middleware.ts.bak                 # Next.js Middleware（一時無効化）
├── .env.local                        # 環境変数（Git管理外）
├── .env.local.example                # 環境変数テンプレート
├── next.config.js                    # Next.js設定
├── tailwind.config.ts                # Tailwind CSS設定
├── tsconfig.json                     # TypeScript設定
└── package.json                      # 依存パッケージ
```

### 主要ファイルの役割

#### バックエンドコア

| ファイル | 役割 | 重要度 |
|---------|-----|--------|
| `lib/supabase.ts` | Supabaseクライアント管理 | ★★★★★ |
| `lib/auth.ts` | NextAuth設定 | ★★★★★ |
| `lib/auth-helpers.ts` | 認証チェック関数 | ★★★★★ |
| `lib/validations.ts` | Zodスキーマ定義 | ★★★★★ |
| `lib/api-helpers.ts` | API共通処理 | ★★★★☆ |
| `lib/error-handlers.ts` | エラーハンドリング | ★★★★☆ |

#### APIエンドポイント

| ファイル | エンドポイント | 認証 |
|---------|--------------|-----|
| `app/api/accounts/route.ts` | GET, POST /api/accounts | POST: 必須 |
| `app/api/accounts/[id]/route.ts` | GET, PUT, PATCH, DELETE | PUT/PATCH/DELETE: 必須 |
| `app/api/purchase-requests/route.ts` | GET, POST | GET: 必須 |
| `app/api/purchase-requests/[id]/route.ts` | GET, PATCH, DELETE | すべて必須 |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth handlers | - |

---

## セキュリティ対策

### 実装済みのセキュリティ対策

#### 1. 認証・認可
- **JWT戦略**: セキュアなトークンベース認証
- **HttpOnly Cookie**: XSS攻撃からトークンを保護
- **セッション有効期限**: 30日間
- **API Route保護**: `checkAuth()`による認証チェック

#### 2. パスワードセキュリティ
- **bcryptjs**: 強力なハッシュアルゴリズム
- **ソルト**: 各パスワードに自動的にソルト追加
- **最小文字数**: 8文字以上
- **複雑性要件**: 英大文字、英小文字、数字を含む

#### 3. 入力バリデーション
- **クライアント側**: Zod + React Hook Form
- **サーバー側**: Zodによる再検証（必須）
- **XSS対策**: React自動エスケープ
- **SQL Injection対策**: Supabaseパラメータ化クエリ

#### 4. データベースセキュリティ
- **Row Level Security (RLS)**: テーブルレベルのアクセス制御
- **制約**: CHECK制約による不正データ防止
- **インデックス**: パフォーマンスとセキュリティの両立

#### 5. エラーハンドリング
- **統一フォーマット**: 情報漏洩を防ぐ
- **ログ記録**: サーバー側でエラー詳細を記録
- **クライアント表示**: 汎用的なメッセージのみ

#### 6. HTTPS
- **本番環境**: Vercelで自動HTTPS
- **開発環境**: ローカルではHTTP（Vercel Previewでテスト）

### セキュリティチェックリスト

- [x] パスワードハッシュ化（bcryptjs）
- [x] JWT認証（HttpOnly Cookie）
- [x] サーバーサイドバリデーション（Zod）
- [x] SQLインジェクション対策（Supabaseパラメータ化）
- [x] XSS対策（React自動エスケープ）
- [x] CSRF対策（NextAuth.js自動処理）
- [x] 環境変数管理（.env.local）
- [ ] レート制限（未実装）
- [ ] CORS設定（デフォルト）
- [ ] Content Security Policy（未実装）
- [ ] セキュリティヘッダー（部分的）

### 環境変数管理

**重要**: 以下の環境変数は絶対にGitにコミットしないこと

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # 特に重要

# NextAuth
NEXTAUTH_SECRET=xxx...  # openssl rand -base64 32 で生成
NEXTAUTH_URL=http://localhost:3000  # 本番: https://your-domain.com
```

---

## エラーハンドリング

### エラーハンドリング戦略

#### 1. レイヤー別エラー処理

```
┌─────────────────────────────────────────────────────────────┐
│                    クライアント                             │
│  - フォームバリデーション（Zod + React Hook Form）         │
│  - ユーザーフレンドリーなエラーメッセージ表示              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ API呼び出し
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Route                                │
│  1. 認証エラー → 401 Unauthorized                           │
│  2. バリデーションエラー → 400 Bad Request + Zodエラー詳細 │
│  3. Supabaseエラー → handleSupabaseError()                  │
│  4. 予期しないエラー → handleError() → 500                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Supabaseクエリ
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase                                 │
│  - 制約違反 → PostgreSQL Error Code                         │
│  - トランザクションエラー                                   │
│  - 接続エラー                                               │
└─────────────────────────────────────────────────────────────┘
```

#### 2. エラーハンドラー関数

**`lib/error-handlers.ts`**:

```typescript
// 統一エラーレスポンス作成
createErrorResponse(message, status, details?, code?)

// Supabaseエラー処理
handleSupabaseError(error: PostgrestError)
  → 23505 (unique_violation) → 409 Conflict
  → 23503 (foreign_key_violation) → 400 Bad Request
  → 23514 (check_violation) → 400 Bad Request
  → PGRST116 (not found) → 404 Not Found

// 汎用エラー処理
handleError(error: unknown)
  → Error instance → 500 + message
  → Unknown → 500 + generic message
```

#### 3. バリデーションエラー

Zodバリデーションエラーは構造化されたJSONとして返される：

```json
{
  "error": "Validation Error",
  "details": {
    "twitter_username": "Twitter IDは英数字とアンダースコアのみ、1-15文字で入力してください",
    "desired_price": "1,000円以上を入力してください",
    "contact_email": "少なくとも1つの連絡先を入力してください"
  }
}
```

#### 4. エラーログ

- **クライアント**: ユーザーフレンドリーなメッセージのみ表示
- **サーバー**: `console.error()`で詳細ログ記録
- **本番環境**: ログ集約サービス（Vercel Logs）

---

## ベストプラクティス

### 1. データフェッチング

#### Server Component（推奨）
```typescript
// app/accounts/page.tsx
import { createServerClient } from '@/lib/supabase'

export default async function AccountsPage() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('accounts')
    .select('*')
    .eq('status', 'available')

  return <AccountList accounts={data} />
}
```

**利点**:
- SEO最適化
- 初期ロードが高速
- データベース直接アクセス

#### API Route経由（認証が必要な場合）
```typescript
// Client Component
const { data } = await fetch('/api/accounts')
```

### 2. バリデーション

**必ずサーバー側でもバリデーション**:
```typescript
// API Route
const validationResult = await validateRequestBody(request, createAccountSchema)
if (validationResult instanceof NextResponse) {
  return validationResult  // エラーレスポンス
}
const { data } = validationResult  // 型安全なデータ
```

### 3. 型安全性

**Zodスキーマから型を生成**:
```typescript
// lib/validations.ts
export const createAccountSchema = z.object({ ... })
export type CreateAccountInput = z.infer<typeof createAccountSchema>

// 使用例
const account: CreateAccountInput = { ... }  // 型安全
```

### 4. エラーハンドリング

**一貫性のあるエラー処理**:
```typescript
try {
  // データベース操作
} catch (error) {
  if (error instanceof PostgrestError) {
    return handleSupabaseError(error)
  }
  return handleError(error)
}
```

### 5. 認証

**APIルートは必ず認証チェック**:
```typescript
export async function POST(request: NextRequest) {
  const authResult = await checkAuth(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }
  // 認証済み処理
}
```

### 6. Supabaseクライアント選択

```typescript
// クライアント側
import { supabase } from '@/lib/supabase'

// Server Component
import { createServerClient } from '@/lib/supabase'
const supabase = createServerClient()

// 管理者権限が必要な場合（API Routeのみ）
import { createAdminClient } from '@/lib/supabase'
const supabase = createAdminClient()
```

### 7. パフォーマンス

**インデックスを活用**:
```sql
-- よく使うフィルター・ソートにはインデックス
CREATE INDEX idx_accounts_status ON accounts(status);
```

**ページネーション**:
```typescript
// 大量データは必ずページネーション
.range(from, to)
```

**キャッシング**（Next.js）:
```typescript
// Server Component
const data = await fetch('...', {
  next: { revalidate: 3600 }  // 1時間キャッシュ
})
```

### 8. コード品質

**一貫性のある命名規則**:
- ファイル: `kebab-case.ts`
- コンポーネント: `PascalCase.tsx`
- 関数: `camelCase()`
- 定数: `UPPER_SNAKE_CASE`

**コメント**:
- 複雑なロジックには説明を追加
- JSDocで関数を文書化

---

## 改善提案

### 高優先度

#### 1. Middlewareの修正（最優先）

**問題**:
- 現在`middleware.ts`が無効化されている
- 管理画面の認証保護がLayout依存

**解決策**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // /admin/login は認証不要
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // /admin/* は認証必須
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

#### 2. Admin Layoutの修正

**復元すべきコード**:
```typescript
// app/admin/layout.tsx
import { requireAuth } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session
  try {
    session = await requireAuth()
  } catch (error) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader session={session} />
        <main className="flex-1 p-6 bg-muted/10">{children}</main>
      </div>
    </div>
  )
}
```

#### 3. レート制限の実装

**推奨ライブラリ**: `@upstash/ratelimit` + Vercel KV

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),  // 10秒あたり10リクエスト
})

// 使用例（API Route）
export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await rateLimiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  // 通常処理
}
```

#### 4. ログシステムの整備

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

// 使用例
logger.info({ userId: session.user.id }, 'User logged in')
logger.error({ error }, 'Database query failed')
```

### 中優先度

#### 5. APIレスポンスキャッシング

```typescript
// app/api/accounts/route.ts
export const revalidate = 60  // 60秒キャッシュ

export async function GET(request: NextRequest) {
  // ...
}
```

#### 6. データベーススキーマの改善

**追加提案**:
```sql
-- アカウント閲覧数トラッキング
ALTER TABLE accounts ADD COLUMN view_count INTEGER DEFAULT 0;

-- アカウント問い合わせ数トラッキング
ALTER TABLE accounts ADD COLUMN inquiry_count INTEGER DEFAULT 0;

-- 買取申込への管理者メモ
ALTER TABLE purchase_requests ADD COLUMN admin_note TEXT;
```

#### 7. 画像アップロード機能

**Supabase Storageを活用**:
```typescript
// lib/storage.ts
import { createAdminClient } from '@/lib/supabase'

export async function uploadImage(
  file: File,
  bucket: string = 'account-images'
): Promise<string> {
  const supabase = createAdminClient()
  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return publicUrl
}
```

### 低優先度

#### 8. APIバージョニング

```typescript
// app/api/v1/accounts/route.ts
// 将来的なAPI変更に備えた構造
```

#### 9. GraphQL検討

大規模化した場合、REST APIからGraphQLへの移行を検討。

#### 10. マイクロサービス分離

トラフィック増加時、以下を独立サービス化:
- 画像処理サービス
- 通知サービス
- 分析サービス

---

## パフォーマンス最適化

### 実装済み
- [x] データベースインデックス
- [x] Next.js Image最適化
- [x] Server Components（SSR）
- [x] Tree Shaking（TypeScript + ESM）

### 推奨施策
- [ ] Redis キャッシング（Vercel KV）
- [ ] CDN（Vercelデフォルト）
- [ ] 遅延ローディング（動的インポート）
- [ ] データベース接続プーリング（Supabaseデフォルト）

---

## モニタリング・運用

### 推奨ツール

1. **Vercel Analytics**: フロントエンドパフォーマンス
2. **Vercel Logs**: API Routeログ
3. **Supabase Dashboard**: データベースパフォーマンス
4. **Sentry**: エラートラッキング（推奨）

### ヘルスチェック

```typescript
// app/api/health/route.ts
export async function GET() {
  const supabase = createServerClient()

  try {
    await supabase.from('accounts').select('id').limit(1)
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 503 })
  }
}
```

---

## まとめ

このバックエンドアーキテクチャは、Next.js 15 App Routerの特性を活かしたモダンなサーバーレス構成です。

### 強み
- 型安全性（TypeScript + Zod）
- スケーラブル（Supabase + Vercel）
- セキュア（NextAuth + bcrypt + RLS）
- 保守性高い（明確なファイル構造）

### 現在の課題
1. Middlewareが無効化されている
2. 管理画面の認証保護が不完全
3. レート制限未実装
4. 包括的なログシステム未実装

### 次のステップ
1. Middleware修正とAdmin Layout復元
2. レート制限実装
3. ログシステム整備
4. 画像アップロード機能追加

---

**更新日**: 2024-10-28
**バージョン**: 1.0.0
**メンテナー**: Claude (Backend Architect)
