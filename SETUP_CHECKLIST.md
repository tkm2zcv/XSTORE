# 🚀 XSTORE セットアップチェックリスト

## 現在の状況

### ✅ 完了済み
- [x] Next.jsプロジェクト作成
- [x] 必要なパッケージインストール
- [x] Supabase接続設定（.env.local）
- [x] バックエンドコード実装
- [x] 開発サーバー起動（port 3030）

### 🔄 次にやること

## Step 1: Supabaseデータベースのセットアップ

### 1-1. テーブルが作成済みか確認

Supabase Dashboard にアクセス：
https://supabase.com/dashboard/project/nwmlovvvyslcleerwohf

左メニュー → **Table Editor** を開く

**確認項目：**
- [ ] `accounts` テーブルが存在するか？
- [ ] `purchase_requests` テーブルが存在するか？
- [ ] `admins` テーブルが存在するか？

### 1-2. テーブルがない場合

`supabase-setup.sql` の内容を実行する：

1. Supabase Dashboard → **SQL Editor**
2. 「New Query」をクリック
3. 以下のファイルの内容をコピペ：
   ```
   C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\supabase-setup.sql
   ```
4. 「Run」ボタンをクリック

**実行後：**
- ✅ 3つのテーブルが作成される
- ✅ サンプルデータ（アカウント12件、申込3件）が挿入される
- ✅ インデックスとRLSポリシーが設定される

---

## Step 2: 管理者アカウントの作成

### 2-1. 管理者アカウントが存在するか確認

Supabase Dashboard → **Table Editor** → **admins** テーブルを開く

**確認：**
- [ ] レコードが1件以上ある？
  - YES → 管理者アカウント作成済み！Step 3へ
  - NO → 以下の手順で作成

### 2-2. 管理者アカウントを新規作成

**方法1: スクリプトで生成（推奨）**

ターミナルで実行：
```bash
node scripts/hash-password.js admin123 admin@xstore.com "管理者"
```

出力されたSQLをコピーして、Supabase SQL Editor で実行

**方法2: 既存のハッシュを使用**

以下のSQLを Supabase SQL Editor で実行：
```sql
INSERT INTO admins (email, password_hash, name)
VALUES (
  'admin@xstore.com',
  '$2a$10$74RqX/RTO4b/6qmg3Bi0Q.j68dP49SgP4AIqZbr3W46Bcwv8TlRGm',
  'XSTORE管理者'
)
ON CONFLICT (email)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name;
```

**ログイン情報：**
- URL: http://localhost:3030/login
- メールアドレス: admin@xstore.com
- パスワード: admin123

---

## Step 3: 動作確認

### 3-1. ログインテスト

1. ブラウザで開く：http://localhost:3030/login
2. 上記のログイン情報でログイン
3. 管理画面（http://localhost:3030/admin）にリダイレクトされる

### 3-2. 管理画面の動作確認

- [ ] ダッシュボード：統計が表示される
- [ ] アカウント管理：サンプルアカウントが表示される
- [ ] 新規出品：フォームが動作する
- [ ] 買取申込：サンプル申込が表示される

### 3-3. 公開ページの動作確認

- [ ] トップページ：http://localhost:3030/
- [ ] アカウント一覧：http://localhost:3030/accounts
- [ ] 買取申込フォーム：http://localhost:3030/purchase

---

## 🎯 次のステップ（セットアップ完了後）

1. **デザインのカスタマイズ**
   - トップページのヒーローセクション
   - カラースキームの調整
   - 画像の差し替え

2. **コンテンツの追加**
   - 利用規約ページ
   - プライバシーポリシー
   - 会社情報

3. **本番環境へのデプロイ**
   - Vercel へのデプロイ
   - 環境変数の設定
   - カスタムドメインの設定

---

## ❓ トラブルシューティング

### ログインできない
- admins テーブルにレコードがあるか確認
- パスワードのハッシュが正しいか確認
- NEXTAUTH_SECRET が設定されているか確認

### データが表示されない
- テーブルにサンプルデータがあるか確認
- Supabaseの接続設定（.env.local）が正しいか確認
- ブラウザのコンソールにエラーが出ていないか確認

### APIエラーが出る
- Supabase Service Role Key が正しいか確認
- RLSポリシーが設定されているか確認

---

## 📚 参考資料

- 開発ガイド（完全版）：`docs/index.html`
- アーキテクチャ図解：`docs/backend-architecture-ui.html`
- Supabaseセットアップ SQL：`supabase-setup.sql`
- パスワードハッシュ生成：`scripts/hash-password.js`
