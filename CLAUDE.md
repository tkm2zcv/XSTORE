# Twitterアカウント買取販売サイト - 要件定義書

## プロジェクト概要

Twitterアカウントの買取・販売を仲介するウェブプラットフォーム。
実際の取引はLINEまたはTwitter経由で行うため、決済機能は実装しない。
プロフェッショナルでモダンなデザインで信頼性を演出する。

---

## 技術スタック

### フロントエンド
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui**

### バックエンド・データベース
- **Supabase** (PostgreSQL)
- **NextAuth.js** (認証)

### デプロイ
- **Vercel** (推奨)

---

## データベーススキーマ

### accounts テーブル（販売中アカウント）
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL, -- @から始まるTwitter ID
  followers_count INTEGER NOT NULL,
  tweets_count INTEGER NOT NULL,
  account_created_at DATE,
  price INTEGER NOT NULL, -- 価格（円）
  category VARCHAR(100), -- カテゴリ（ビジネス、エンタメ、スポーツ等）
  description TEXT,
  status VARCHAR(50) DEFAULT 'available', -- available, sold, pending
  image_url TEXT, -- アカウントのプロフィール画像URL
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_category ON accounts(category);
CREATE INDEX idx_accounts_price ON accounts(price);
CREATE INDEX idx_accounts_followers ON accounts(followers_count);
```

### purchase_requests テーブル（買取申込）
```sql
CREATE TABLE purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  twitter_username VARCHAR(255) NOT NULL, -- @から始まるTwitter ID
  desired_price INTEGER NOT NULL, -- 希望価格（円）
  contact_email VARCHAR(255),
  contact_twitter VARCHAR(255),
  contact_instagram VARCHAR(255),
  tweet_image_url TEXT, -- アップロードされた画像ツイートのURL
  status VARCHAR(50) DEFAULT 'pending', -- pending, reviewing, approved, rejected
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX idx_purchase_requests_created_at ON purchase_requests(created_at);
```

### admins テーブル（管理者）
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- bcryptでハッシュ化
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ページ構成とルーティング

### 公開ページ
- `/` - トップページ
- `/accounts` - 販売中アカウント一覧
- `/accounts/[id]` - アカウント詳細
- `/purchase` - 買取申込フォーム
- `/terms` - 利用規約
- `/privacy` - プライバシーポリシー

### 管理画面（認証必須）
- `/admin` - 管理ダッシュボード
- `/admin/accounts` - アカウント管理（一覧・出品・編集・削除）
- `/admin/accounts/new` - 新規アカウント出品
- `/admin/accounts/[id]/edit` - アカウント編集
- `/admin/requests` - 買取申込一覧

---

## 機能要件

### 1. トップページ
- ヒーローセクション（サービス説明）
- 注目のアカウント表示（3-6件）
- カテゴリ別アカウント紹介
- LINE・Twitter誘導用のCTAボタン
- サービスの特徴・安心ポイント

### 2. 販売中アカウント一覧
- カード形式でアカウント表示
  - プロフィール画像
  - @username
  - フォロワー数
  - 投稿数
  - 価格
  - カテゴリ
- フィルター機能
  - 価格帯（スライダー）
  - フォロワー数範囲
  - カテゴリ（複数選択可）
- ソート機能
  - 価格（安い順・高い順）
  - フォロワー数（多い順・少ない順）
  - 新着順
- ページネーションまたは無限スクロール

### 3. アカウント詳細ページ
- アカウント情報の詳細表示
  - プロフィール画像
  - @username
  - フォロワー数
  - 投稿数
  - アカウント作成日
  - カテゴリ
  - 詳細説明
  - 価格
- 購入問い合わせボタン（LINE・Twitter誘導）
- 関連アカウント表示

### 4. 買取申込フォーム
- 入力項目
  - Twitter ID (@username)
  - 希望価格（数値入力）
  - 連絡先
    - メールアドレス
    - Twitter ID
    - Instagram ID
  - 画像ツイートのアップロード（1枚）
- バリデーション
  - 必須項目チェック
  - 形式チェック（メール、価格）
  - 画像サイズ制限
- 送信後の確認メッセージ

### 5. 管理画面（認証必須）
#### ログイン
- NextAuth.jsによる認証
- メールアドレス＋パスワード

#### アカウント管理
- 一覧表示（フィルター・検索付き）
- 新規出品
  - フォーム入力
  - 画像アップロード
- 編集
- 削除（ソフトデリート推奨）
- ステータス変更（販売中・売却済み）

#### 買取申込管理
- 申込一覧表示
- ステータス変更（pending, reviewing, approved, rejected）
- 詳細確認

### 6. 利用規約・プライバシーポリシー
- 静的ページ
- マークダウンまたはHTML

---

## デザイン要件

### カラースキーム
- **プライマリ**: 水色系（#06b6d4 - Cyan 500）
- **セカンダリ**: 白・黒・グレー
- **ダークモード**: 黒背景、水色アクセント
- **ライトモード**: 白背景、黒テキスト、水色アクセント

### テーマ設定（Tailwind + Shadcn/ui）
```css
/* カスタムカラー */
--primary: 189 94% 43%; /* Cyan 500 */
--primary-foreground: 0 0% 100%;
--secondary: 0 0% 96%;
--secondary-foreground: 0 0% 9%;
```

### デザインコンセプト
- モダン・ミニマル
- プロフェッショナル
- 信頼性重視
- レスポンシブデザイン（モバイルファースト）
- アニメーション控えめ（パフォーマンス重視）

### UIコンポーネント方針
- Shadcn/uiの標準コンポーネントを活用
- カスタマイズは必要最小限
- アクセシビリティ確保（ARIA属性、キーボード操作）

---

## Next.js App Router ベストプラクティス

### 1. ディレクトリ構造
```
/app
  /(public)           # 公開ページグループ
    /page.tsx         # トップページ
    /accounts
      /page.tsx       # 一覧
      /[id]
        /page.tsx     # 詳細
    /purchase
      /page.tsx       # 買取申込
    /terms
      /page.tsx
    /privacy
      /page.tsx
    /layout.tsx       # 公開ページ共通レイアウト

  /admin              # 管理画面
    /layout.tsx       # 管理画面共通レイアウト（認証チェック）
    /page.tsx         # ダッシュボード
    /accounts
      /page.tsx       # 一覧
      /new
        /page.tsx     # 新規作成
      /[id]
        /edit
          /page.tsx   # 編集
    /requests
      /page.tsx       # 買取申込一覧

  /api
    /auth
      /[...nextauth]  # NextAuth.js
        /route.ts
    /accounts         # Supabase API
      /route.ts
      /[id]
        /route.ts
    /purchase-requests
      /route.ts

  /layout.tsx         # ルートレイアウト
  /providers.tsx      # Context Providers

/components
  /ui                 # Shadcn/ui コンポーネント
  /layout             # レイアウトコンポーネント
    /Header.tsx
    /Footer.tsx
    /Navigation.tsx
  /accounts           # アカウント関連
    /AccountCard.tsx
    /AccountList.tsx
    /AccountFilter.tsx
  /forms              # フォーム
    /PurchaseForm.tsx
  /admin              # 管理画面専用
    /AccountForm.tsx
    /RequestTable.tsx

/lib
  /supabase.ts        # Supabase クライアント
  /auth.ts            # NextAuth 設定
  /utils.ts           # ユーティリティ関数
  /validations.ts     # Zodバリデーション

/types
  /index.ts           # 型定義

/hooks
  /useTheme.ts        # テーマフック
  /useAccounts.ts     # データフェッチフック
```

### 2. Server Components vs Client Components
#### Server Components（デフォルト）
- データフェッチ
- SEOが重要なページ
- 静的コンテンツ
```tsx
// app/(public)/accounts/page.tsx
import { getAccounts } from '@/lib/supabase';

export default async function AccountsPage() {
  const accounts = await getAccounts();
  return <AccountList accounts={accounts} />;
}
```

#### Client Components（'use client'）
- インタラクティブな機能（フィルター、検索）
- useState, useEffect, イベントハンドラー
- ブラウザAPI使用時
```tsx
'use client';
import { useState } from 'react';

export function AccountFilter() {
  const [price, setPrice] = useState([0, 100000]);
  // ...
}
```

### 3. データフェッチング戦略
#### Server-side Fetch（推奨）
```tsx
// Server Component
async function getData() {
  const res = await fetch('https://...', {
    cache: 'force-cache', // 静的データ
    // または
    next: { revalidate: 3600 }, // ISR (1時間ごと再検証)
  });
  return res.json();
}
```

#### Client-side Fetch
```tsx
// Client Component
'use client';
import useSWR from 'swr';

export function AccountList() {
  const { data, error } = useSWR('/api/accounts', fetcher);
  // ...
}
```

### 4. メタデータとSEO
```tsx
// app/(public)/accounts/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const account = await getAccount(params.id);
  return {
    title: `${account.username} - Twitterアカウント販売`,
    description: `フォロワー${account.followers_count}人のTwitterアカウント`,
    openGraph: {
      images: [account.image_url],
    },
  };
}
```

### 5. エラーハンドリング
```tsx
// app/(public)/accounts/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  );
}
```

### 6. ローディング状態
```tsx
// app/(public)/accounts/loading.tsx
export default function Loading() {
  return <AccountListSkeleton />;
}
```

### 7. 環境変数
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 8. 画像最適化
```tsx
import Image from 'next/image';

<Image
  src={account.image_url}
  alt={account.username}
  width={200}
  height={200}
  className="rounded-full"
  priority={false} // LCPに影響しない場合はfalse
/>
```

### 9. フォントの最適化
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 10. Route Handlers（API Routes）
```tsx
// app/api/accounts/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('status', 'available');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  // ...
}
```

### 11. 認証保護（Middleware）
```tsx
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/admin/:path*'],
};
```

### 12. 型安全性（TypeScript）
```tsx
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
```

### 13. バリデーション（Zod）
```tsx
// lib/validations.ts
import { z } from 'zod';

export const purchaseRequestSchema = z.object({
  twitter_username: z
    .string()
    .min(1, '必須項目です')
    .regex(/^@?[A-Za-z0-9_]+$/, '正しいTwitter IDを入力してください'),
  desired_price: z
    .number()
    .min(1, '1円以上を入力してください')
    .max(10000000, '価格が高すぎます'),
  contact_email: z.string().email('正しいメールアドレスを入力してください').optional(),
  contact_twitter: z.string().optional(),
  contact_instagram: z.string().optional(),
});
```

### 14. パフォーマンス最適化
- Dynamic Import（コード分割）
```tsx
import dynamic from 'next/dynamic';

const AdminChart = dynamic(() => import('@/components/admin/Chart'), {
  ssr: false, // クライアント側のみ
  loading: () => <ChartSkeleton />,
});
```

- Suspense Boundary
```tsx
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <AccountList />
</Suspense>
```

### 15. セキュリティ
- CSP（Content Security Policy）
```tsx
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

- CSRF対策（NextAuth.jsが自動処理）
- XSS対策（React自動エスケープ）
- SQL Injection対策（Supabaseのパラメータ化クエリ）

---

## 開発フロー

### 1. セットアップ
```bash
npx create-next-app@latest twi-kaitori --typescript --tailwind --app
cd twi-kaitori
npx shadcn-ui@latest init
npm install @supabase/supabase-js next-auth bcryptjs zod
npm install -D @types/bcryptjs
```

### 2. Supabaseセットアップ
- プロジェクト作成
- テーブル作成（上記SQL実行）
- 環境変数設定

### 3. 実装順序
1. カラースキーム・テーマ設定
2. 共通レイアウト（Header, Footer）
3. Supabaseクライアント設定
4. NextAuth.js設定
5. 型定義・バリデーション
6. 公開ページ実装
   - トップページ
   - アカウント一覧
   - アカウント詳細
   - 買取申込フォーム
7. 管理画面実装
   - 認証
   - アカウント管理
   - 買取申込管理
8. 利用規約・プライバシーポリシー
9. テスト・デバッグ
10. デプロイ

---

## 注意事項

### 法的コンプライアンス
- Twitterの利用規約遵守
- 個人情報保護法対応
- 特定商取引法に基づく表記（必要に応じて）

### セキュリティ
- 管理画面は必ず認証保護
- 環境変数の適切な管理
- XSS, CSRF, SQLインジェクション対策
- HTTPS必須（本番環境）

### パフォーマンス
- 画像最適化（Next.js Image）
- コード分割
- キャッシング戦略
- Lighthouse Score 90+目標

### アクセシビリティ
- セマンティックHTML
- ARIA属性
- キーボード操作
- スクリーンリーダー対応

---

## 今後の拡張性

### Phase 2（将来的な機能）
- サイト内決済機能（Stripe連携）
- チャット機能
- レビュー・評価システム
- 検索履歴・お気に入り機能
- メール通知
- 多言語対応（i18n）
- アナリティクス（Google Analytics）

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## チケット管理ルール

### チケットファイルの構成
- チケットは `/docs` ディレクトリ配下で管理
- ファイル名: `001_チケット名.md`, `002_チケット名.md` のように連番を振る
- 各チケットファイル内でタスク管理を行う

### タスクチェックリストの記法
- 未完了タスク: `- [ ] タスク名`
- 完了タスク: `- [x] タスク名`

### チケットの進め方
1. チケットファイルを開く
2. タスクを確認し、上から順に実装
3. タスクが完了したら `- [ ]` を `- [x]` に変更
4. すべてのタスクが完了したらチケットクローズ

### チケット一覧
チケットの一覧は `/docs/README.md` で管理する
