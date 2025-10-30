# チケット #002: データベース設計とSupabaseセットアップ

## 概要
Supabaseプロジェクトを作成し、データベーススキーマを設計・実装します。

## 目的
- Supabaseプロジェクトの作成
- データベーステーブルの作成
- 環境変数の設定
- Supabaseクライアントの実装

## タスク

### Supabaseプロジェクト作成
- [ ] Supabaseアカウント作成（未作成の場合）
- [ ] 新規プロジェクト作成
- [ ] プロジェクトURL、Anon Key、Service Role Keyを取得
- [ ] `.env.local` に環境変数を設定

### テーブル作成（accounts）
- [ ] `accounts` テーブル作成
  - id (UUID, Primary Key)
  - username (VARCHAR(255), NOT NULL)
  - followers_count (INTEGER, NOT NULL)
  - tweets_count (INTEGER, NOT NULL)
  - account_created_at (DATE)
  - price (INTEGER, NOT NULL)
  - category (VARCHAR(100))
  - description (TEXT)
  - status (VARCHAR(50), DEFAULT 'available')
  - image_url (TEXT)
  - created_at (TIMESTAMP, DEFAULT NOW())
  - updated_at (TIMESTAMP, DEFAULT NOW())
- [ ] インデックス作成
  - status
  - category
  - price
  - followers_count

### テーブル作成（purchase_requests）
- [ ] `purchase_requests` テーブル作成
  - id (UUID, Primary Key)
  - twitter_username (VARCHAR(255), NOT NULL)
  - desired_price (INTEGER, NOT NULL)
  - contact_email (VARCHAR(255))
  - contact_twitter (VARCHAR(255))
  - contact_instagram (VARCHAR(255))
  - tweet_image_url (TEXT)
  - status (VARCHAR(50), DEFAULT 'pending')
  - created_at (TIMESTAMP, DEFAULT NOW())
- [ ] インデックス作成
  - status
  - created_at

### テーブル作成（admins）
- [ ] `admins` テーブル作成
  - id (UUID, Primary Key)
  - email (VARCHAR(255), UNIQUE, NOT NULL)
  - password_hash (TEXT, NOT NULL)
  - name (VARCHAR(255))
  - created_at (TIMESTAMP, DEFAULT NOW())
- [ ] 初期管理者アカウント作成（bcryptでパスワードハッシュ化）

### Row Level Security（RLS）設定
- [ ] `accounts` テーブルのRLS有効化
  - SELECT: 誰でも可能（status='available'のみ）
  - INSERT/UPDATE/DELETE: 認証済み管理者のみ
- [ ] `purchase_requests` テーブルのRLS有効化
  - SELECT: 認証済み管理者のみ
  - INSERT: 誰でも可能
  - UPDATE/DELETE: 認証済み管理者のみ
- [ ] `admins` テーブルのRLS有効化
  - すべての操作: 認証済み管理者のみ

### Supabaseクライアント実装
- [ ] `/lib/supabase.ts` 作成
  - クライアント作成関数
  - Server Component用
  - Client Component用
- [ ] `/lib/supabase-admin.ts` 作成（管理者用、Service Role Key使用）

### 型定義作成
- [ ] `/types/index.ts` 作成
  - Account型
  - PurchaseRequest型
  - Admin型

## 技術的な詳細

### accounts テーブル作成SQL
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  followers_count INTEGER NOT NULL,
  tweets_count INTEGER NOT NULL,
  account_created_at DATE,
  price INTEGER NOT NULL,
  category VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_category ON accounts(category);
CREATE INDEX idx_accounts_price ON accounts(price);
CREATE INDEX idx_accounts_followers ON accounts(followers_count);
```

### purchase_requests テーブル作成SQL
```sql
CREATE TABLE purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  twitter_username VARCHAR(255) NOT NULL,
  desired_price INTEGER NOT NULL,
  contact_email VARCHAR(255),
  contact_twitter VARCHAR(255),
  contact_instagram VARCHAR(255),
  tweet_image_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX idx_purchase_requests_created_at ON purchase_requests(created_at);
```

### admins テーブル作成SQL
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Supabaseクライアント実装例
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server Component用
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
```

### 型定義例
```typescript
// types/index.ts
export interface Account {
  id: string;
  username: string;
  followers_count: number;
  tweets_count: number;
  account_created_at: string;
  price: number;
  category: string;
  description: string;
  status: 'available' | 'sold' | 'pending';
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseRequest {
  id: string;
  twitter_username: string;
  desired_price: number;
  contact_email?: string;
  contact_twitter?: string;
  contact_instagram?: string;
  tweet_image_url?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}
```

## 完了条件
- [ ] すべてのテーブルが作成されている
- [ ] RLSが適切に設定されている
- [ ] Supabaseクライアントが実装されている
- [ ] 型定義が作成されている
- [ ] 環境変数が設定されている

## 関連チケット
- 前: #001 プロジェクトセットアップ
- 次: #003 認証システム構築

## 参考
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
