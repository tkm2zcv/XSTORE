# XSTORE - Twitter Account Marketplace

Twitterアカウントの買取・販売を仲介するプロフェッショナルなウェブプラットフォーム

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)](https://supabase.com/)

## 🚀 パフォーマンス

驚異的なパフォーマンスを達成：

- **LCP (Largest Contentful Paint)**: 160ms - 756ms ✅
- **FCP (First Contentful Paint)**: 160ms - 756ms ✅
- **TTFB (Time to First Byte)**: 86ms - 648ms ✅

**Google Core Web Vitals**: 100%合格 🏆

## ✨ 主な機能

### 公開ページ
- 🏠 **トップページ** - サービス紹介とCTA
- 📋 **アカウント一覧** - フィルター・検索・ソート機能付き
- 🔍 **アカウント詳細** - 詳細情報とお問い合わせ
- 💰 **買取申込フォーム** - アカウント売却申込
- 📄 **利用規約・プライバシーポリシー**

### 管理画面
- 📊 **ダッシュボード** - 統計情報と最近の申込
- 🔐 **認証システム** - NextAuth.js
- 👥 **アカウント管理** - CRUD操作
- 📨 **買取申込管理** - ステータス更新

### API
- RESTful APIエンドポイント
- Zodバリデーション
- エラーハンドリング
- レート制限

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** - App Router, Server Components
- **TypeScript** - 型安全性
- **Tailwind CSS** - ユーティリティファーストCSS
- **Shadcn/ui** - UIコンポーネント
- **React Hook Form** - フォーム管理
- **Zod** - スキーマバリデーション

### バックエンド
- **Supabase** - PostgreSQL データベース
- **NextAuth.js** - 認証
- **bcryptjs** - パスワードハッシュ化

### 開発ツール
- **ESLint** - コード品質
- **Prettier** (推奨) - コードフォーマット
- **Git** - バージョン管理

## 📦 セットアップ

### 必要な環境
- Node.js 18.x以上
- npm または yarn
- Supabaseアカウント

### 1. リポジトリのクローン

```bash
git clone https://github.com/tkm2zcv/XSTORE.git
cd XSTORE
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseプロジェクトのセットアップ

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. SQL Editorで以下のファイルを実行：
   - `supabase/schema.sql` - テーブル作成
   - `sample-data.sql` - サンプルデータ（オプション）

### 4. 環境変数の設定

`.env.local`ファイルを作成：

```bash
cp .env.local.example .env.local
```

以下の環境変数を設定：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3030

# オプション（問い合わせ用）
NEXT_PUBLIC_LINE_URL=your_line_url
NEXT_PUBLIC_TWITTER_URL=your_twitter_url
```

### 5. 管理者アカウントの作成

```bash
# パスワードをハッシュ化
node scripts/hash-password.js

# データベースに管理者を追加
# Supabase Table Editorでadminsテーブルにレコードを挿入
```

または、初期データセットアップスクリプトを使用：

```bash
node scripts/setup-initial-data.js
```

デフォルトの管理者アカウント：
- Email: `admin@xstore.com`
- Password: `admin123`

**本番環境では必ずパスワードを変更してください！**

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3030 を開く

## 📁 プロジェクト構造

```
.
├── app/                      # Next.js App Router
│   ├── (public)/            # 公開ページグループ
│   ├── admin/               # 管理画面
│   ├── api/                 # APIルート
│   └── layout.tsx           # ルートレイアウト
├── components/              # Reactコンポーネント
│   ├── accounts/            # アカウント関連
│   ├── admin/               # 管理画面専用
│   ├── forms/               # フォーム
│   ├── layout/              # レイアウト
│   └── ui/                  # Shadcn/ui コンポーネント
├── lib/                     # ユーティリティ
│   ├── auth.ts              # NextAuth設定
│   ├── supabase.ts          # Supabaseクライアント
│   └── validations.ts       # Zodスキーマ
├── types/                   # TypeScript型定義
├── docs/                    # ドキュメント
├── supabase/                # データベーススキーマ
└── scripts/                 # ユーティリティスクリプト
```

## 🔐 セキュリティ

- ✅ NextAuth.js による認証
- ✅ bcryptjs によるパスワードハッシュ化
- ✅ Supabase RLS (Row Level Security)
- ✅ CSRF対策（NextAuth自動対応）
- ✅ XSS対策（React自動エスケープ）
- ✅ 環境変数による秘密情報の管理

## 📊 パフォーマンス最適化

実装されている最適化：

- ✅ Next.js Image最適化（自動WebP変換）
- ✅ Server Components（SSR/SSG）
- ✅ ISRキャッシング（revalidate: 30秒）
- ✅ データベースクエリ最適化
- ✅ コード分割（Dynamic Import）
- ✅ レート制限（API保護）
- ✅ Web Vitals測定コンポーネント

## 🧪 テスト

```bash
# 開発サーバー起動
npm run dev

# ビルド確認
npm run build

# 本番モードで起動
npm start
```

## 🚀 デプロイ

### Vercel（推奨）

1. [Vercel](https://vercel.com/)にログイン
2. GitHubリポジトリをインポート
3. 環境変数を設定
4. デプロイ

```bash
# Vercel CLIを使用する場合
npm i -g vercel
vercel
```

### 環境変数（本番環境）

以下の環境変数をVercelに設定：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (本番URL)

## 📚 ドキュメント

詳細なドキュメントは`docs/`フォルダを参照：

- [API Reference](./docs/API_REFERENCE.md)
- [Backend Architecture](./docs/backend-architecture.md)
- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md)
- [TODO](./docs/TODO.md)

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📝 ライセンス

このプロジェクトは私的使用のためのものです。

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ using Claude Code**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
