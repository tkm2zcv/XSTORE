# 管理者アカウントのセットアップ

このドキュメントでは、Twitterアカウント買取販売サイトの管理者アカウントを作成する方法を説明します。

## 前提条件

- Supabaseプロジェクトが作成済みであること
- データベーステーブル（`admins`テーブル）が作成済みであること
- Node.jsがインストールされていること

---

## 方法1: bcryptjsを使ってパスワードをハッシュ化（推奨）

### ステップ1: パスワードハッシュ生成スクリプトを作成

プロジェクトのルートディレクトリに`scripts`フォルダを作成し、パスワードハッシュ生成スクリプトを作成します。

```bash
mkdir -p scripts
```

`scripts/hash-password.js`を作成:

```javascript
const bcrypt = require('bcryptjs');

// コマンドライン引数からパスワードを取得
const password = process.argv[2];

if (!password) {
  console.error('使い方: node scripts/hash-password.js <パスワード>');
  process.exit(1);
}

// bcryptでパスワードをハッシュ化（ソルトラウンド: 10）
const hash = bcrypt.hashSync(password, 10);

console.log('\n=== パスワードハッシュ生成完了 ===');
console.log('元のパスワード:', password);
console.log('ハッシュ化されたパスワード:', hash);
console.log('\n以下のSQLを使用してSupabaseに管理者を追加してください:\n');
console.log(`INSERT INTO admins (email, password_hash, name) VALUES (
  'admin@example.com',
  '${hash}',
  'Admin User'
);\n`);
```

### ステップ2: bcryptjsをインストール

```bash
npm install bcryptjs
```

### ステップ3: パスワードをハッシュ化

```bash
node scripts/hash-password.js your_password_here
```

例:
```bash
node scripts/hash-password.js password123
```

出力例:
```
=== パスワードハッシュ生成完了 ===
元のパスワード: password123
ハッシュ化されたパスワード: $2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

以下のSQLを使用してSupabaseに管理者を追加してください:

INSERT INTO admins (email, password_hash, name) VALUES (
  'admin@example.com',
  '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Admin User'
);
```

### ステップ4: Supabaseで管理者を作成

1. [Supabase Dashboard](https://supabase.com/dashboard)にログイン
2. プロジェクトを選択
3. 左メニューから「Table Editor」を選択
4. `admins`テーブルを選択
5. 「Insert row」ボタンをクリック
6. 以下の情報を入力:
   - **email**: 管理者のメールアドレス（例: `admin@example.com`）
   - **password_hash**: ステップ3で生成されたハッシュをコピー＆ペースト
   - **name**: 管理者の名前（例: `Admin User`）
7. 「Save」をクリック

または、SQLエディタを使用:

1. 左メニューから「SQL Editor」を選択
2. 「New query」をクリック
3. 以下のSQLを貼り付け（ステップ3で生成されたSQL）:

```sql
INSERT INTO admins (email, password_hash, name) VALUES (
  'admin@example.com',
  '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Admin User'
);
```

4. 「Run」ボタンをクリック

---

## 方法2: Supabase SQL EditorでPostgreSQL関数を使用

Supabaseには`crypt`関数がありますが、bcryptと互換性がない場合があるため、**方法1を推奨**します。

---

## ログイン方法

### ステップ1: 開発サーバーを起動

```bash
npm run dev
```

### ステップ2: 管理画面ログインページにアクセス

ブラウザで以下のURLを開く:
```
http://localhost:3000/admin/login
```

または、現在のポート番号に合わせて:
```
http://localhost:3020/admin/login
```

### ステップ3: ログイン

- **メールアドレス**: Supabaseに登録したメールアドレス（例: `admin@example.com`）
- **パスワード**: ハッシュ化前の元のパスワード（例: `password123`）

---

## トラブルシューティング

### ログインできない場合

1. **Supabaseの認証情報を確認**
   - `.env.local`ファイルのSupabase URLとキーが正しいか確認
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **NextAuth設定を確認**
   - `.env.local`ファイルのNextAuth設定が正しいか確認
   ```env
   NEXTAUTH_SECRET=your_random_secret_string
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **adminsテーブルにデータが存在するか確認**
   - Supabase Dashboardの「Table Editor」で`admins`テーブルを確認
   - データが正しく挿入されているか確認

4. **パスワードハッシュが正しいか確認**
   - bcryptjsでハッシュ化されたパスワードであることを確認
   - ハッシュは`$2a$10$`または`$2b$10$`で始まる

5. **ブラウザのコンソールを確認**
   - F12キーを押して開発者ツールを開く
   - Consoleタブでエラーメッセージを確認

### NextAuth CLIENT_FETCH_ERRORが出る場合

`.env.local`の`NEXTAUTH_URL`がサーバーのポート番号と一致しているか確認:

```env
# サーバーがポート3020で起動している場合
NEXTAUTH_URL=http://localhost:3020
```

---

## セキュリティのベストプラクティス

### 本番環境での注意事項

1. **強力なパスワードを使用**
   - 最低12文字以上
   - 英大文字・小文字・数字・記号を組み合わせる
   - 例: `Xk#9mL@pQ2wE5rT!`

2. **NEXTAUTH_SECRETを変更**
   - ランダムな文字列を生成:
   ```bash
   openssl rand -base64 32
   ```
   - 生成された文字列を`.env.local`の`NEXTAUTH_SECRET`に設定

3. **HTTPSを使用**
   - 本番環境では必ずHTTPSを使用
   - Vercelでデプロイする場合は自動的にHTTPSが有効化されます

4. **環境変数を公開しない**
   - `.env.local`ファイルをGitにコミットしない
   - `.gitignore`に`.env.local`が含まれていることを確認

5. **管理者アカウントの定期的な見直し**
   - 不要な管理者アカウントを削除
   - パスワードを定期的に変更

---

## 複数の管理者を追加する

追加の管理者を作成する場合は、上記の手順を繰り返してください:

1. パスワードをハッシュ化:
   ```bash
   node scripts/hash-password.js new_password_here
   ```

2. Supabaseに挿入:
   ```sql
   INSERT INTO admins (email, password_hash, name) VALUES (
     'new-admin@example.com',
     '$2a$10$new_hash_here',
     'New Admin Name'
   );
   ```

---

## 管理者の削除

Supabaseで管理者を削除する場合:

### SQL Editorを使用:

```sql
DELETE FROM admins WHERE email = 'admin-to-delete@example.com';
```

### Table Editorを使用:

1. `admins`テーブルを開く
2. 削除したい行の右側にある「...」メニューをクリック
3. 「Delete row」を選択
4. 確認して削除

---

## まとめ

管理者アカウントの作成手順:

1. ✅ `scripts/hash-password.js`スクリプトを作成
2. ✅ bcryptjsをインストール: `npm install bcryptjs`
3. ✅ パスワードをハッシュ化: `node scripts/hash-password.js your_password`
4. ✅ SupabaseのTable EditorまたはSQL Editorで管理者を追加
5. ✅ http://localhost:3020/admin/login でログイン

これで管理画面にアクセスできるようになります！🎉
