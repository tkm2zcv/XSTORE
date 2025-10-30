# Supabase MCP サーバー セットアップガイド

## 📋 完了したこと

✅ `@supabase/mcp-server-supabase` をグローバルインストール
✅ Claude Code 設定ファイル (`claude_desktop_config.json`) を準備

## 🔑 次にやること：Personal Access Token の取得

### Step 1: Supabase Dashboard にアクセス

```
https://supabase.com/dashboard
```

### Step 2: Access Token を生成

1. 右上のアカウントアイコンをクリック
2. **Account Settings** を選択
3. 左メニューから **Access Tokens** を選択
4. **Generate new token** ボタンをクリック

### Step 3: Token 情報を入力

- **Name**: `Claude Code` （または任意の名前）
- **Scopes**: 以下を選択（全て選択推奨）
  - ✅ Read access
  - ✅ Write access
  - ✅ All projects access

### Step 4: Token をコピー

⚠️ **重要**: 生成されたトークンは一度しか表示されません！
必ずコピーして安全な場所に保存してください。

### Step 5: 設定ファイルに貼り付け

**ファイルパス:**
```
C:\Users\takuma\AppData\Roaming\Claude\claude_desktop_config.json
```

**設定内容:**
```json
{
  "preferences": {
    "legacyQuickEntryEnabled": false
  },
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "ここに生成したトークンを貼り付け"
      ]
    }
  }
}
```

### Step 6: Claude Code を再起動

設定を反映させるために、Claude Code を完全に再起動してください。

---

## 🎯 再起動後の確認方法

Claude Code を再起動したら、こう聞いてみてください：

**「Supabase MCP ツールが使えるか確認して」**

利用可能なツールの一覧に以下のようなツールが表示されれば成功：
- `mcp__supabase__*` で始まるツール群
- データベース操作系のツール

---

## 📝 使用例

### テーブル一覧を取得
```
「Supabaseのテーブル一覧を表示して」
```

### データを挿入
```
「adminsテーブルに管理者アカウントを追加して」
```

### データを取得
```
「accountsテーブルの全データを取得して」
```

### SQLクエリを実行
```
「purchase_requestsテーブルでstatusがpendingのものを取得して」
```

---

## 🔒 セキュリティに関する注意

- Personal Access Token は **パスワードと同じくらい重要**です
- 他人と共有しないでください
- GitHub などにコミットしないでください
- 設定ファイル (`claude_desktop_config.json`) はローカルのみに保存されます

---

## 🆚 Service Role Key との違い

| 項目 | Personal Access Token | Service Role Key |
|------|---------------------|-----------------|
| 用途 | Supabase Management API | データベース直接アクセス |
| 範囲 | 全プロジェクト管理 | 特定プロジェクトのDB |
| 生成場所 | Account Settings | Project Settings |
| MCP サーバー | ✅ これを使う | ❌ 使わない |

---

## 📚 参考リンク

- [Supabase MCP Server GitHub](https://github.com/supabase/mcp-server-supabase)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Model Context Protocol](https://modelcontextprotocol.io/)
