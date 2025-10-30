-- ============================================
-- XSTORE Database Schema
-- Twitter Account Marketplace
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- accounts テーブル（販売中アカウント）
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  followers_count INTEGER NOT NULL CHECK (followers_count >= 0),
  following_count INTEGER DEFAULT 0 CHECK (following_count >= 0),
  tweets_count INTEGER NOT NULL CHECK (tweets_count >= 0),
  account_created_date DATE,
  price INTEGER NOT NULL CHECK (price >= 0),
  category VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- accounts テーブルのインデックス
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_category ON accounts(category);
CREATE INDEX idx_accounts_price ON accounts(price);
CREATE INDEX idx_accounts_followers ON accounts(followers_count);
CREATE INDEX idx_accounts_created_at ON accounts(created_at DESC);

-- purchase_requests テーブル（買取申込）
CREATE TABLE purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  twitter_username VARCHAR(255) NOT NULL,
  desired_price INTEGER NOT NULL CHECK (desired_price >= 0),
  contact_email VARCHAR(255),
  contact_twitter VARCHAR(255),
  contact_instagram VARCHAR(255),
  message TEXT,
  has_image_tweet BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 少なくとも1つの連絡先が必要
  CONSTRAINT at_least_one_contact CHECK (
    contact_email IS NOT NULL OR
    contact_twitter IS NOT NULL OR
    contact_instagram IS NOT NULL
  )
);

-- purchase_requests テーブルのインデックス
CREATE INDEX idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX idx_purchase_requests_created_at ON purchase_requests(created_at DESC);
CREATE INDEX idx_purchase_requests_username ON purchase_requests(twitter_username);

-- admins テーブル（管理者）
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,

  -- メールアドレス形式チェック
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================
-- TRIGGERS
-- ============================================

-- accounts テーブルの updated_at 自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- accounts テーブルのRLS有効化
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- 誰でも販売中のアカウントを閲覧可能
CREATE POLICY "Anyone can view available accounts"
  ON accounts FOR SELECT
  USING (status = 'available');

-- 認証済みユーザーのみ全アカウント閲覧可能（管理画面用）
CREATE POLICY "Authenticated users can view all accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザーのみアカウント作成・更新・削除可能
CREATE POLICY "Authenticated users can insert accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete accounts"
  ON accounts FOR DELETE
  TO authenticated
  USING (true);

-- purchase_requests テーブルのRLS有効化
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

-- 誰でも買取申込を作成可能
CREATE POLICY "Anyone can create purchase requests"
  ON purchase_requests FOR INSERT
  WITH CHECK (true);

-- 認証済みユーザーのみ全申込を閲覧・更新・削除可能
CREATE POLICY "Authenticated users can view all requests"
  ON purchase_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update requests"
  ON purchase_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete requests"
  ON purchase_requests FOR DELETE
  TO authenticated
  USING (true);

-- admins テーブルのRLS有効化
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーのみadminsテーブルにアクセス可能
CREATE POLICY "Authenticated users can manage admins"
  ON admins FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
