# 🚀 Supabase 簡単セットアップガイド

このガイドに従って進めれば、誰でも5-10分でデータベースのセットアップが完了します。

---

## 📌 ステップ1: Supabaseプロジェクトを作る

### 1-1. Supabaseにアクセス
👉 https://supabase.com を開く

### 1-2. サインイン/サインアップ
- GitHubアカウントでログインするのが簡単
- または、メールアドレスで新規登録

### 1-3. 新しいプロジェクトを作成
1. 緑色の **「New Project」** ボタンをクリック
2. 以下を入力:
   - **Name（名前）**: `twi-kaitori` と入力
   - **Database Password（パスワード）**: 強力なパスワードを設定
     - ⚠️ このパスワードは**メモ帳などに保存**してください！
   - **Region（地域）**: `Northeast Asia (Tokyo)` を選択
   - **Pricing Plan（料金プラン）**: `Free` を選択

3. **「Create new project」** ボタンをクリック

4. ⏳ 1-2分待つ（プロジェクトが作成されるまで）

---

## 📌 ステップ2: データベースにテーブルを作る

### 2-1. SQL Editorを開く
1. 左側のメニューから **「SQL Editor」** をクリック
2. **「New query」** ボタンをクリック

### 2-2. SQLをコピペして実行
1. プロジェクト内の `supabase/schema.sql` ファイルを開く
2. **全ての内容をコピー**（Ctrl+A → Ctrl+C）
3. Supabaseの SQL Editor に**貼り付け**（Ctrl+V）
4. 右下の緑色の **「Run」** ボタンをクリック

### 2-3. 成功を確認
✅ 下に「Success. No rows returned」と表示されればOK！

---

## 📌 ステップ3: 接続情報を取得してプロジェクトに設定

### 3-1. 接続情報をコピーする

1. 左側のメニューから **「Settings」（歯車アイコン）** をクリック
2. **「API」** をクリック

3. 以下の3つをコピーしてメモ帳などに保存:

   **① Project URL**
   ```
   例: https://abcdefghijk.supabase.co
   ```

   **② anon public （公開キー）**
   ```
   例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...（長い文字列）
   ```

   **③ service_role （管理者キー）**
   ```
   例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...（長い文字列）
   ```
   ⚠️ service_roleキーは**絶対に公開しないでください**！

### 3-2. プロジェクトに設定ファイルを作る

1. プロジェクトのルートフォルダを開く
2. `.env.local.example` というファイルをコピーして `.env.local` という名前で保存
3. `.env.local` を開いて、以下のように編集:

```env
# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# ============================================
# Contact URLs（後で設定してもOK）
# ============================================
NEXT_PUBLIC_LINE_URL=
NEXT_PUBLIC_TWITTER_URL=
```

👆 `your_supabase_project_url` などを、コピーした実際の値に置き換えてください

4. ファイルを**保存**

### 3-3. 開発サーバーを再起動

ターミナルで:
```bash
# 現在動いているサーバーを停止（Ctrl + C）
# 再起動
npm run dev
```

---

## ✅ セットアップ完了！

これで、データベースの準備が完了しました！

### 🔍 動作確認

1. ブラウザで http://localhost:3000 を開く
2. エラーが出なければ成功！

---

## ❓ うまくいかない場合

### エラー: 「NEXT_PUBLIC_SUPABASE_URL is not defined」
→ `.env.local` ファイルを保存し忘れていませんか？
→ 開発サーバーを再起動しましたか？

### テーブルが作成されていない
→ `schema.sql` の**全ての内容**をコピーできていますか？
→ SQLエディタで「Run」ボタンを押しましたか？

### その他のエラー
→ `.env.local` の値が正しくコピペされているか確認
→ ダブルクォーテーション（`"`）などの余計な文字が入っていないか確認

---

## 📚 次のステップ

データベースができたら、次は:
- 管理画面でアカウントを登録できるようにする
- 実際のデータを投入する

お疲れさまでした！🎉
