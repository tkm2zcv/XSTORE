# ドキュメント

Twitterアカウント買取販売サイトの技術ドキュメント集

## 目次

### アーキテクチャ
- [Backend Architecture](./backend-architecture.md) - バックエンドアーキテクチャの全体像

### API仕様
- [API Reference](./API_REFERENCE.md) - RESTful API完全リファレンス

### 実装ガイド
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - 実装手順とトラブルシューティング

### データベース
- [Supabase Setup](../supabase/SETUP.md) - データベースセットアップ手順
- [Schema](../supabase/schema.sql) - データベーススキーマ定義

### プロジェクト管理
- [Tickets](./TICKETS_README.md) - 実装チケット一覧と進捗管理

## ドキュメント概要

### Backend Architecture
バックエンドシステムの設計思想、データフロー、技術スタック、セキュリティ対策を網羅した包括的なドキュメント。

**主なトピック**:
- システム全体像とコンポーネント図
- データベース設計（ERD、インデックス戦略、RLS）
- API設計（RESTful原則、エンドポイント一覧）
- 認証・認可フロー（NextAuth.js、JWT戦略）
- エラーハンドリング戦略
- パフォーマンス最適化
- セキュリティベストプラクティス

**対象読者**: バックエンドエンジニア、アーキテクト、技術リード

### API Reference
すべてのAPIエンドポイントの詳細仕様。リクエスト/レスポンス例、バリデーションルール、エラーケースを含む。

**主なトピック**:
- 認証API（ログイン、ログアウト、セッション）
- アカウント管理API（CRUD操作）
- 買取申込API（作成、一覧、ステータス更新）
- エラーレスポンス標準形式
- Rate Limiting仕様
- クライアント実装例（JavaScript/TypeScript）

**対象読者**: フロントエンドエンジニア、APIクライアント開発者

### Implementation Guide
実際にコードを実装・修正するための実践的なガイド。具体的な手順とトラブルシューティングを含む。

**主なトピック**:
- 認証フロー修正手順（Middleware、Admin Layout）
- Rate Limiting実装ガイド
- Logging実装ガイド
- テスト方法（手動、自動、cURL）
- トラブルシューティング（よくある問題と解決策）
- 開発環境から本番環境への移行

**対象読者**: 開発者（すべてのレベル）

## クイックスタート

### 新規参入者向け

1. **まずこれを読む**: [Backend Architecture](./backend-architecture.md)
   - システム全体を理解する

2. **次にこれを読む**: [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
   - 開発環境のセットアップ

3. **APIを使う**: [API Reference](./API_REFERENCE.md)
   - APIの使い方を学ぶ

### 既存開発者向け

#### バックエンドを修正する場合
1. [Backend Architecture](./backend-architecture.md)で現在の設計を確認
2. [Implementation Guide](./IMPLEMENTATION_GUIDE.md)で実装手順を確認
3. 修正後、APIドキュメントも更新

#### フロントエンドでAPIを使う場合
1. [API Reference](./API_REFERENCE.md)で必要なエンドポイントを探す
2. リクエスト例をコピーして修正
3. エラーハンドリングも実装

#### データベースを修正する場合
1. [Backend Architecture](./backend-architecture.md)のER図を確認
2. [../supabase/schema.sql](../supabase/schema.sql)を修正
3. マイグレーションを実行
4. TypeScript型定義も更新（`types/index.ts`）

## 主要ファイルパス

すべてのファイルパスは絶対パスで記載しています。

### ドキュメント
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\docs\backend-architecture.md`
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\docs\API_REFERENCE.md`
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\docs\IMPLEMENTATION_GUIDE.md`

### 主要実装ファイル
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\middleware.ts` - Next.js Middleware（認証保護）
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\app\admin\layout.tsx` - 管理画面レイアウト
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\lib\auth.ts` - NextAuth設定
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\lib\supabase.ts` - Supabaseクライアント
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\lib\rate-limit.ts` - Rate Limiting（新規）
- `C:\Users\takuma\マイドライブ\PC\kiwamero coding\twi-kaitori\lib\logger.ts` - ロギング（新規）

## 今回の変更内容

### 新規作成されたファイル

1. **バックエンドアーキテクチャドキュメント**
   - パス: `docs/backend-architecture.md`
   - 内容: システム全体の設計、データベース、API、認証フロー、セキュリティ

2. **API Reference**
   - パス: `docs/API_REFERENCE.md`
   - 内容: 全エンドポイントの詳細仕様、リクエスト/レスポンス例

3. **実装ガイド**
   - パス: `docs/IMPLEMENTATION_GUIDE.md`
   - 内容: 実装手順、テスト方法、トラブルシューティング

4. **Middleware（修正版）**
   - パス: `middleware.ts`
   - 内容: Next.js 15対応の認証Middleware

5. **Rate Limitingユーティリティ**
   - パス: `lib/rate-limit.ts`
   - 内容: インメモリRate Limiter、本番用実装ガイド

6. **ロギングユーティリティ**
   - パス: `lib/logger.ts`
   - 内容: 構造化ロガー、パフォーマンス計測

### 修正されたファイル

1. **Admin Layout**
   - パス: `app/admin/layout.tsx`
   - 変更: 認証チェックを有効化、ダミーセッション削除

## ドキュメント更新ガイドライン

### いつ更新すべきか

- [ ] 新しいAPIエンドポイントを追加した
- [ ] 既存のAPIレスポンス形式を変更した
- [ ] データベーススキーマを変更した
- [ ] 認証フローを変更した
- [ ] 重要なバグを修正した（トラブルシューティングに追加）
- [ ] 新しいベストプラクティスを導入した

### 更新手順

1. 該当するドキュメントを特定
2. マークダウンファイルを編集
3. 変更履歴セクションに追記
4. Pull Requestを作成（レビュー推奨）

### ドキュメント品質チェックリスト

- [ ] コード例が正確で動作する
- [ ] すべてのリンクが有効
- [ ] 専門用語に説明がある
- [ ] 図表が最新
- [ ] 日付とバージョンが更新されている

## 追加リソース

### 外部ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)

### プロジェクト内ドキュメント

- [CLAUDE.md](../CLAUDE.md) - プロジェクト全体の要件定義
- [package.json](../package.json) - 依存パッケージ一覧
- [.env.local.example](../.env.local.example) - 環境変数テンプレート

## 次のステップ

### Immediate（即座に対応）
1. [ ] Middlewareの動作確認
2. [ ] Admin Layoutでの認証が正常に機能するかテスト
3. [ ] 古いバックアップファイル（`middleware.ts.bak`）を削除

### Short-term（短期）
1. [ ] Rate Limitingを公開フォーム（`POST /api/purchase-requests`）に適用
2. [ ] ロギングを全APIエンドポイントに実装
3. [ ] エラーログを確認し、よくあるエラーをドキュメント化

### Mid-term（中期）
1. [ ] 本番環境用Rate Limiting（Upstash + Vercel KV）の導入
2. [ ] Sentry等のエラートラッキングツール導入
3. [ ] 画像アップロード機能（Supabase Storage）の実装
4. [ ] APIバージョニング検討

### Long-term（長期）
1. [ ] パフォーマンスモニタリングの強化
2. [ ] ログ分析とアラート設定
3. [ ] セキュリティ監査
4. [ ] スケーラビリティテスト

## サポート

### 質問・相談

- **技術的な質問**: GitHub Issuesまたはチーム内チャット
- **ドキュメントの不備**: Pull Requestで修正を提案
- **緊急の問題**: チームリードに連絡

### 貢献

このドキュメントの改善提案は大歓迎です。

1. Fork the repository
2. Create a branch (`git checkout -b docs/improve-xxx`)
3. Make your changes
4. Submit a Pull Request

---

## ライセンス

このプロジェクトは内部使用のためのものです。

---

**最終更新**: 2024-10-28
**メンテナー**: Backend Team
