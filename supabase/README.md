# 🚀 Supabase セットアップガイド

XSTOREのデータベースをSupabaseで構築する手順を、初心者にもわかりやすく説明します。

## 📝 このガイドで行うこと

1. Supabaseでプロジェクトを作る
2. データベースにテーブルを作る（SQLを実行するだけ）
3. 接続情報をコピペして設定する

**所要時間: 約5-10分**

---

## ステップ1️⃣: Supabaseアカウント作成とプロジェクト作成

### 1. Supabaseプロジェクトの作成

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にアクセス
2. 「New Project」をクリック
3. プロジェクト情報を入力:
   - **Name**: `twi-kaitori` (または任意の名前)
   - **Database Password**: 強力なパスワードを設定（必ず保存してください）
   - **Region**: `Northeast Asia (Tokyo)` を推奨
   - **Pricing Plan**: 開発環境では Free プランで十分
4. 「Create new project」をクリック
5. プロジェクトの作成完了まで1-2分待機

### 2. データベーススキーマの適用

1. Supabaseダッシュボードで作成したプロジェクトを開く
2. 左サイドバーから「SQL Editor」を選択
3. 「New query」をクリック
4. `supabase/schema.sql` ファイルの内容を全てコピー
5. SQLエディタに貼り付けて「Run」をクリック
6. 成功メッセージが表示されることを確認

### 3. API認証情報の取得

1. 左サイドバーから「Settings」 > 「API」を選択
2. 以下の3つの値をコピー:
   - **Project URL** (例: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (公開キー)
   - **service_role** key (サービスロールキー、**絶対に公開しないこと**)

### 4. 環境変数の設定

1. プロジェクトルートで `.env.local` ファイルを作成:
   ```bash
   cp .env.local.example .env.local
   ```

2. `.env.local` を開いて、取得した値を設定:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Contact URLs (後で設定)
   NEXT_PUBLIC_LINE_URL=
   NEXT_PUBLIC_TWITTER_URL=
   ```

3. ファイルを保存

### 5. 開発サーバーの再起動

環境変数を反映させるため、開発サーバーを再起動:

```bash
# 現在のサーバーを停止 (Ctrl+C)
# 再度起動
npm run dev
```

## データベース構造

### テーブル一覧

#### `accounts` - 販売中アカウント
| カラム名 | 型 | 説明 |
|---------|---|------|
| id | UUID | 主キー |
| username | VARCHAR(255) | Twitter ID |
| display_name | VARCHAR(255) | 表示名 |
| followers_count | INTEGER | フォロワー数 |
| following_count | INTEGER | フォロー数 |
| tweets_count | INTEGER | ツイート数 |
| account_created_date | DATE | アカウント作成日 |
| price | INTEGER | 価格（円） |
| category | VARCHAR(100) | カテゴリ |
| description | TEXT | 説明 |
| status | VARCHAR(50) | ステータス (available/sold/pending) |
| image_url | TEXT | プロフィール画像URL |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

#### `purchase_requests` - 買取申込
| カラム名 | 型 | 説明 |
|---------|---|------|
| id | UUID | 主キー |
| twitter_username | VARCHAR(255) | Twitter ID |
| desired_price | INTEGER | 希望価格（円） |
| contact_email | VARCHAR(255) | メールアドレス |
| contact_twitter | VARCHAR(255) | Twitter ID |
| contact_instagram | VARCHAR(255) | Instagram ID |
| message | TEXT | メッセージ |
| has_image_tweet | BOOLEAN | 画像ツイート確認 |
| status | VARCHAR(50) | ステータス (pending/reviewing/approved/rejected) |
| created_at | TIMESTAMP | 作成日時 |

#### `admins` - 管理者
| カラム名 | 型 | 説明 |
|---------|---|------|
| id | UUID | 主キー |
| email | VARCHAR(255) | メールアドレス（ユニーク） |
| password_hash | TEXT | パスワードハッシュ |
| name | VARCHAR(255) | 名前 |
| created_at | TIMESTAMP | 作成日時 |
| last_login_at | TIMESTAMP | 最終ログイン日時 |

## Row Level Security (RLS)

データベースにはRow Level Security (RLS) が設定されており、以下のルールが適用されています:

### `accounts` テーブル
- **SELECT**: 誰でも `status='available'` のレコードを閲覧可能
- **SELECT (認証済み)**: すべてのレコードを閲覧可能
- **INSERT/UPDATE/DELETE**: 認証済みユーザーのみ

### `purchase_requests` テーブル
- **INSERT**: 誰でも作成可能（フォーム送信）
- **SELECT/UPDATE/DELETE**: 認証済みユーザーのみ

### `admins` テーブル
- **ALL**: 認証済みユーザーのみ

## テストデータの挿入（オプション）

開発環境でテストデータを挿入する場合:

1. SQL Editorで以下を実行:

```sql
-- サンプルアカウント
INSERT INTO accounts (username, display_name, followers_count, following_count, tweets_count, price, category, description, status)
VALUES
  ('test_user_1', 'テストユーザー1', 10000, 500, 5000, 50000, 'ビジネス', 'ビジネス系アカウント', 'available'),
  ('test_user_2', 'テストユーザー2', 50000, 1000, 10000, 150000, 'エンタメ', 'エンタメ系アカウント', 'available');

-- サンプル買取申込
INSERT INTO purchase_requests (twitter_username, desired_price, contact_email, has_image_tweet)
VALUES
  ('buyer_test', 30000, 'test@example.com', true);
```

## トラブルシューティング

### エラー: "NEXT_PUBLIC_SUPABASE_URL is not defined"
→ `.env.local` ファイルが正しく設定されているか確認し、開発サーバーを再起動してください

### データが表示されない
→ RLSポリシーを確認してください。管理画面では認証が必要です

### SQL実行エラー
→ `schema.sql` の全ての内容が正しくコピー&ペーストされているか確認してください

## 次のステップ

データベースのセットアップが完了したら:

1. ✅ 認証システムの構築（チケット #003）
2. ✅ 管理画面の実装（チケット #010-012）
3. ✅ 本番環境へのデプロイ

## 参考リンク

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
