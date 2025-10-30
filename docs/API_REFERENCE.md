# API Reference

Twitter アカウント買取販売サイトのAPI仕様書

**Base URL**: `http://localhost:3000/api` (開発環境)
**Base URL**: `https://your-domain.com/api` (本番環境)

## 認証

### 認証方式

NextAuth.jsによるセッションベース認証（JWT）を使用。

#### ログイン

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**成功レスポンス**:
```json
{
  "url": "/admin"
}
```

セッションCookieが`Set-Cookie`ヘッダーで返されます。

#### ログアウト

```http
POST /api/auth/signout
```

#### セッション確認

```http
GET /api/auth/session
```

**レスポンス**:
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User"
  },
  "expires": "2024-11-27T00:00:00.000Z"
}
```

---

## Accounts（アカウント）

### GET /api/accounts

販売中のアカウント一覧を取得

**認証**: 不要（公開API）

**クエリパラメータ**:

| パラメータ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `category` | string | - | カテゴリフィルター |
| `minPrice` | number | - | 最小価格 |
| `maxPrice` | number | - | 最大価格 |
| `minFollowers` | number | - | 最小フォロワー数 |
| `maxFollowers` | number | - | 最大フォロワー数 |
| `status` | string | `available` | ステータス |
| `sortBy` | string | `created_at` | ソートフィールド |
| `order` | string | `desc` | ソート順序 |
| `page` | number | 1 | ページ番号 |
| `limit` | number | 12 | 1ページあたりの件数 |

**例**:
```http
GET /api/accounts?category=ビジネス&minFollowers=1000&sortBy=followers_count&order=desc&page=1&limit=12
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "business_pro",
      "display_name": "Business Professional",
      "followers_count": 50000,
      "following_count": 1500,
      "tweets_count": 12000,
      "account_created_date": "2018-03-15",
      "price": 80000,
      "category": "ビジネス",
      "description": "ビジネス系の影響力の高いアカウント",
      "status": "available",
      "image_url": "https://example.com/profile.jpg",
      "created_at": "2024-10-01T10:00:00Z",
      "updated_at": "2024-10-01T10:00:00Z"
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

**エラーレスポンス**:
```json
{
  "error": "Validation Error",
  "details": {
    "minPrice": "価格は0以上で入力してください"
  }
}
```

---

### GET /api/accounts/:id

アカウント詳細を取得

**認証**: 不要（公開API）

**パスパラメータ**:
- `id` (UUID): アカウントID

**例**:
```http
GET /api/accounts/550e8400-e29b-41d4-a716-446655440000
```

**レスポンス**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "business_pro",
    "followers_count": 50000,
    "tweets_count": 12000,
    "account_created_date": "2018-03-15",
    "price": 80000,
    "category": "ビジネス",
    "description": "詳細な説明...",
    "status": "available",
    "image_url": "https://example.com/profile.jpg",
    "created_at": "2024-10-01T10:00:00Z",
    "updated_at": "2024-10-01T10:00:00Z"
  }
}
```

**エラーレスポンス**:
```json
{
  "error": "アカウントが見つかりません"
}
```
HTTP Status: `404 Not Found`

---

### POST /api/accounts

新規アカウントを出品

**認証**: 必須（管理者のみ）

**リクエストボディ**:
```json
{
  "username": "new_account",
  "display_name": "New Account Name",
  "followers_count": 10000,
  "following_count": 500,
  "tweets_count": 5000,
  "account_created_date": "2020-01-01",
  "price": 50000,
  "category": "ビジネス",
  "description": "アカウントの説明",
  "image_url": "https://example.com/profile.jpg"
}
```

**バリデーション**:
- `username`: 必須、1-15文字、英数字とアンダースコアのみ
- `followers_count`: 必須、0以上の整数
- `tweets_count`: 必須、0以上の整数
- `price`: 必須、1円以上、10,000,000円以下
- `category`: オプション、指定のカテゴリのみ
- `description`: オプション、1000文字以内
- `image_url`: オプション、有効なURL形式

**レスポンス**:
```json
{
  "data": {
    "id": "新規UUID",
    "username": "new_account",
    "status": "available",
    "created_at": "2024-10-28T12:00:00Z",
    "updated_at": "2024-10-28T12:00:00Z",
    ...
  }
}
```
HTTP Status: `201 Created`

**エラーレスポンス（未認証）**:
```json
{
  "error": "Unauthorized"
}
```
HTTP Status: `401 Unauthorized`

**エラーレスポンス（バリデーション）**:
```json
{
  "error": "Validation Error",
  "details": {
    "username": "Twitter IDは英数字とアンダースコアのみ、1-15文字で入力してください",
    "price": "価格は1円以上で入力してください"
  }
}
```
HTTP Status: `400 Bad Request`

---

### PUT /api/accounts/:id

アカウント情報を更新（完全置換）

**認証**: 必須（管理者のみ）

**パスパラメータ**:
- `id` (UUID): アカウントID

**リクエストボディ**:
```json
{
  "username": "updated_account",
  "followers_count": 12000,
  "tweets_count": 6000,
  "price": 55000,
  "status": "available",
  ...
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "updated_account",
    "updated_at": "2024-10-28T12:30:00Z",
    ...
  }
}
```
HTTP Status: `200 OK`

---

### PATCH /api/accounts/:id

アカウント情報を部分更新

**認証**: 必須（管理者のみ）

**パスパラメータ**:
- `id` (UUID): アカウントID

**リクエストボディ（例：価格のみ更新）**:
```json
{
  "price": 45000
}
```

**リクエストボディ（例：ステータス変更）**:
```json
{
  "status": "sold"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "price": 45000,
    "updated_at": "2024-10-28T12:45:00Z",
    ...
  }
}
```
HTTP Status: `200 OK`

---

### DELETE /api/accounts/:id

アカウントを削除

**認証**: 必須（管理者のみ）

**パスパラメータ**:
- `id` (UUID): アカウントID

**レスポンス**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
HTTP Status: `200 OK`

**注意**: 現在の実装は物理削除です。本番環境ではソフトデリート（`deleted_at`カラム追加）を推奨します。

---

## Purchase Requests（買取申込）

### GET /api/purchase-requests

買取申込一覧を取得

**認証**: 必須（管理者のみ）

**クエリパラメータ**:

| パラメータ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `status` | string | - | ステータスフィルター |
| `startDate` | string | - | 開始日時（ISO 8601） |
| `endDate` | string | - | 終了日時（ISO 8601） |
| `sortBy` | string | `created_at` | ソートフィールド |
| `order` | string | `desc` | ソート順序 |
| `page` | number | 1 | ページ番号 |
| `limit` | number | 20 | 1ページあたりの件数 |

**例**:
```http
GET /api/purchase-requests?status=pending&sortBy=created_at&order=desc&page=1&limit=20
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "twitter_username": "user_account",
      "desired_price": 30000,
      "contact_email": "user@example.com",
      "contact_twitter": "@contact_user",
      "contact_instagram": "@contact_user",
      "message": "アカウント売却希望",
      "has_image_tweet": true,
      "status": "pending",
      "created_at": "2024-10-28T10:00:00Z"
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

---

### POST /api/purchase-requests

買取申込を作成

**認証**: 不要（公開フォーム）

**Rate Limit**: 3リクエスト/時間（同一IPアドレス）

**リクエストボディ**:
```json
{
  "twitter_username": "my_account",
  "desired_price": 25000,
  "contact_email": "seller@example.com",
  "contact_twitter": "@seller",
  "contact_instagram": "@seller",
  "message": "アカウントの特徴や売却理由など",
  "has_image_tweet": true
}
```

**バリデーション**:
- `twitter_username`: 必須、1-15文字、英数字とアンダースコアのみ
- `desired_price`: 必須、1,000円以上、10,000,000円以下
- 連絡先: `contact_email`, `contact_twitter`, `contact_instagram`のうち少なくとも1つ必須
- `contact_email`: メールアドレス形式
- `message`: オプション、1000文字以内
- `has_image_tweet`: 必須、`true`でなければエラー

**レスポンス**:
```json
{
  "data": {
    "id": "新規UUID",
    "twitter_username": "my_account",
    "desired_price": 25000,
    "status": "pending",
    "created_at": "2024-10-28T12:00:00Z",
    ...
  }
}
```
HTTP Status: `201 Created`

**エラーレスポンス（バリデーション）**:
```json
{
  "error": "Validation Error",
  "details": {
    "twitter_username": "Twitter IDは英数字とアンダースコアのみ、1-15文字で入力してください",
    "desired_price": "1,000円以上を入力してください",
    "contact_email": "少なくとも1つの連絡先を入力してください",
    "has_image_tweet": "ハッシュタグやメンションなしの画像付きツイートがあることを確認してください"
  }
}
```
HTTP Status: `400 Bad Request`

**エラーレスポンス（Rate Limit）**:
```json
{
  "error": "リクエストが多すぎます。しばらく待ってから再度お試しください。",
  "retryAfter": 3540
}
```
HTTP Status: `429 Too Many Requests`

Headers:
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1698504000
Retry-After: 3540
```

---

### GET /api/purchase-requests/:id

買取申込詳細を取得

**認証**: 必須（管理者のみ）

**パスパラメータ**:
- `id` (UUID): 買取申込ID

**レスポンス**:
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "twitter_username": "user_account",
    "desired_price": 30000,
    "contact_email": "user@example.com",
    "contact_twitter": "@contact_user",
    "contact_instagram": "@contact_user",
    "message": "詳細なメッセージ",
    "has_image_tweet": true,
    "status": "pending",
    "created_at": "2024-10-28T10:00:00Z"
  }
}
```

---

### PATCH /api/purchase-requests/:id

買取申込のステータスを更新

**認証**: 必須（管理者のみ）

**パスパラメータ**:
- `id` (UUID): 買取申込ID

**リクエストボディ**:
```json
{
  "status": "approved"
}
```

**ステータス値**:
- `pending`: 申込受付中
- `reviewing`: 審査中
- `approved`: 承認済み
- `rejected`: 却下

**レスポンス**:
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "approved",
    ...
  }
}
```
HTTP Status: `200 OK`

---

### DELETE /api/purchase-requests/:id

買取申込を削除

**認証**: 必須（管理者のみ）

**パスパラメータ**:
- `id` (UUID): 買取申込ID

**レスポンス**:
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001"
  }
}
```
HTTP Status: `200 OK`

---

## エラーレスポンス

### 標準エラーフォーマット

すべてのエラーレスポンスは以下の形式に従います：

```json
{
  "error": "エラーメッセージ",
  "details": {
    "field_name": "フィールド固有のエラー"
  },
  "code": "ERROR_CODE"
}
```

### HTTPステータスコード

| コード | 意味 | 使用例 |
|-------|-----|-------|
| 200 | OK | 成功 |
| 201 | Created | リソース作成成功 |
| 400 | Bad Request | バリデーションエラー |
| 401 | Unauthorized | 認証が必要 |
| 403 | Forbidden | 権限不足 |
| 404 | Not Found | リソースが見つからない |
| 409 | Conflict | 重複エラー |
| 429 | Too Many Requests | Rate Limit超過 |
| 500 | Internal Server Error | サーバーエラー |

### よくあるエラー

#### 認証エラー
```json
{
  "error": "Unauthorized"
}
```
HTTP Status: `401`

#### バリデーションエラー
```json
{
  "error": "Validation Error",
  "details": {
    "username": "必須項目です",
    "price": "1円以上を入力してください"
  }
}
```
HTTP Status: `400`

#### データベースエラー（重複）
```json
{
  "error": "このデータは既に存在します",
  "code": "DUPLICATE_ERROR"
}
```
HTTP Status: `409`

#### Not Found
```json
{
  "error": "データが見つかりません",
  "code": "NOT_FOUND"
}
```
HTTP Status: `404`

---

## Rate Limiting

### 制限内容

| エンドポイント | 制限 | 識別子 |
|--------------|------|-------|
| `POST /api/purchase-requests` | 3リクエスト/時間 | IPアドレス |
| `POST /api/auth/signin` | 5リクエスト/15分 | IPアドレス |
| その他の書き込みAPI | 10リクエスト/10秒 | セッション |
| 読み取りAPI | 30リクエスト/分 | IPアドレス |

### Rate Limitヘッダー

```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1698504000
Retry-After: 3600
```

- `X-RateLimit-Limit`: 制限値
- `X-RateLimit-Remaining`: 残り回数
- `X-RateLimit-Reset`: リセット時刻（Unix timestamp）
- `Retry-After`: 再試行まで待つ秒数

---

## クライアント実装例

### JavaScript (fetch)

```javascript
// アカウント一覧取得
async function getAccounts(filters = {}) {
  const params = new URLSearchParams(filters)
  const response = await fetch(`/api/accounts?${params}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return await response.json()
}

// アカウント作成（認証必須）
async function createAccount(data) {
  const response = await fetch('/api/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // Cookie送信
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return await response.json()
}

// 買取申込
async function submitPurchaseRequest(data) {
  const response = await fetch('/api/purchase-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    if (response.status === 429) {
      throw new Error(`Rate limit exceeded. Retry after ${error.retryAfter} seconds.`)
    }
    throw new Error(error.error)
  }

  return await response.json()
}
```

### TypeScript (型安全)

```typescript
import type { Account, PurchaseRequest } from '@/types'

interface ApiResponse<T> {
  data: T
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

async function getAccounts(
  filters?: Record<string, string | number>
): Promise<PaginatedResponse<Account>> {
  const params = new URLSearchParams(
    filters as Record<string, string>
  )
  const response = await fetch(`/api/accounts?${params}`)

  if (!response.ok) throw new Error('Failed to fetch accounts')

  return await response.json()
}

async function createPurchaseRequest(
  data: Omit<PurchaseRequest, 'id' | 'status' | 'created_at'>
): Promise<ApiResponse<PurchaseRequest>> {
  const response = await fetch('/api/purchase-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return await response.json()
}
```

---

## 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0.0 | 2024-10-28 | 初版リリース |

---

**更新日**: 2024-10-28
**バージョン**: 1.0.0
**メンテナー**: Backend Team
