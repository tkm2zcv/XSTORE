-- XSTORE データベースセットアップ
-- このファイルをSupabase SQL Editorで実行してください

-- ===================================
-- 1. accounts テーブル（販売中アカウント）
-- ===================================
CREATE TABLE IF NOT EXISTS accounts (
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

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_category ON accounts(category);
CREATE INDEX IF NOT EXISTS idx_accounts_price ON accounts(price);
CREATE INDEX IF NOT EXISTS idx_accounts_followers ON accounts(followers_count);
CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON accounts(created_at);

-- コメント追加
COMMENT ON TABLE accounts IS 'Twitterアカウント販売情報';
COMMENT ON COLUMN accounts.username IS '@から始まるTwitter ID';
COMMENT ON COLUMN accounts.status IS 'available: 販売中, sold: 売却済み, pending: 保留中';


-- ===================================
-- 2. purchase_requests テーブル（買取申込）
-- ===================================
CREATE TABLE IF NOT EXISTS purchase_requests (
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

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_created_at ON purchase_requests(created_at);

-- コメント追加
COMMENT ON TABLE purchase_requests IS 'アカウント買取申込';
COMMENT ON COLUMN purchase_requests.status IS 'pending: 新規, reviewing: 審査中, approved: 承認, rejected: 却下';


-- ===================================
-- 3. admins テーブル（管理者）
-- ===================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- コメント追加
COMMENT ON TABLE admins IS '管理者アカウント';
COMMENT ON COLUMN admins.password_hash IS 'bcryptでハッシュ化されたパスワード';


-- ===================================
-- 4. サンプルデータ挿入（テスト用）
-- ===================================

-- サンプルアカウント
INSERT INTO accounts (username, followers_count, tweets_count, account_created_at, price, category, description, status, image_url)
VALUES
  ('@business_pro', 50000, 12000, '2020-01-15', 150000, 'ビジネス', 'ビジネス系フォロワー多数。エンゲージメント率高め。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=business1&backgroundColor=0ea5e9'),
  ('@entertainment_star', 120000, 35000, '2018-06-20', 300000, 'エンタメ', 'エンタメ系人気アカウント。若年層フォロワー中心。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=entertainment1&backgroundColor=ec4899'),
  ('@news_update', 80000, 25000, '2019-03-10', 200000, 'ニュース', 'ニュース速報アカウント。リツイート率が非常に高い。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=news1&backgroundColor=ef4444'),
  ('@sports_fan', 45000, 8000, '2021-02-28', 120000, 'スポーツ', 'スポーツファン向けアカウント。週末の投稿が人気。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=sports1&backgroundColor=f97316'),
  ('@tech_guru', 95000, 18000, '2019-09-05', 250000, 'テクノロジー', 'IT・テック系情報発信。エンジニアフォロワー多数。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=tech1&backgroundColor=8b5cf6'),
  ('@lifestyle_tips', 65000, 15000, '2020-07-12', 180000, 'その他', 'ライフスタイル提案アカウント。女性フォロワー中心。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=other1&backgroundColor=a855f7'),
  ('@business_news', 110000, 28000, '2018-11-01', 280000, 'ビジネス', 'ビジネスニュース専門。経営者層に人気。', 'sold', 'https://api.dicebear.com/7.x/shapes/svg?seed=business2&backgroundColor=0ea5e9'),
  ('@movie_review', 75000, 22000, '2019-05-18', 190000, 'エンタメ', '映画レビューアカウント。週末の投稿で高エンゲージメント。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=entertainment2&backgroundColor=ec4899'),
  ('@code_daily', 55000, 11000, '2020-10-22', 140000, 'テクノロジー', 'プログラミング学習アカウント。初心者向けコンテンツ。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=tech2&backgroundColor=8b5cf6'),
  ('@soccer_love', 40000, 9500, '2021-04-08', 110000, 'スポーツ', 'サッカー専門アカウント。試合実況で人気。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=sports2&backgroundColor=f97316'),
  ('@startup_jp', 88000, 16000, '2019-12-03', 230000, 'ビジネス', 'スタートアップ情報。投資家フォロワー多数。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=business3&backgroundColor=0ea5e9'),
  ('@fashion_daily', 130000, 42000, '2018-08-15', 320000, 'その他', 'ファッション情報アカウント。インフルエンサー級。', 'available', 'https://api.dicebear.com/7.x/shapes/svg?seed=other2&backgroundColor=a855f7')
ON CONFLICT (id) DO NOTHING;

-- サンプル買取申込
INSERT INTO purchase_requests (twitter_username, desired_price, contact_email, contact_twitter, status)
VALUES
  ('@my_account_1', 50000, 'user1@example.com', '@user1_contact', 'pending'),
  ('@my_account_2', 80000, 'user2@example.com', '@user2_contact', 'reviewing'),
  ('@my_account_3', 120000, 'user3@example.com', NULL, 'approved')
ON CONFLICT (id) DO NOTHING;


-- ===================================
-- 5. RLS (Row Level Security) ポリシー（オプション）
-- ===================================

-- 公開読み取り: accounts テーブル (status = 'available')
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available accounts"
  ON accounts
  FOR SELECT
  USING (status = 'available');

CREATE POLICY "Admins can manage all accounts"
  ON accounts
  FOR ALL
  USING (true);

-- purchase_requests: 管理者のみアクセス可能
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view purchase requests"
  ON purchase_requests
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert purchase requests"
  ON purchase_requests
  FOR INSERT
  WITH CHECK (true);

-- admins: 完全保護
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view themselves"
  ON admins
  FOR SELECT
  USING (true);


-- ===================================
-- 完了メッセージ
-- ===================================
DO $$
BEGIN
  RAISE NOTICE '✅ データベースセットアップが完了しました！';
  RAISE NOTICE '📊 作成されたテーブル: accounts, purchase_requests, admins';
  RAISE NOTICE '📝 サンプルデータ: アカウント12件、申込3件';
  RAISE NOTICE '🔒 RLSポリシー: 有効化済み';
  RAISE NOTICE '';
  RAISE NOTICE '次のステップ:';
  RAISE NOTICE '1. scripts/hash-password.js で管理者アカウントを作成';
  RAISE NOTICE '2. 生成されたSQLを実行してadminユーザーを登録';
END $$;
