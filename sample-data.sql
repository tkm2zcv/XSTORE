-- サンプルデータ挿入SQL
-- 管理画面のテスト用に使用

-- ===================================
-- サンプルアカウント（12件）
-- ===================================
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

-- ===================================
-- サンプル買取申込（3件）
-- ===================================
INSERT INTO purchase_requests (twitter_username, desired_price, contact_email, contact_twitter, status)
VALUES
  ('@my_account_1', 50000, 'user1@example.com', '@user1_contact', 'pending'),
  ('@my_account_2', 80000, 'user2@example.com', '@user2_contact', 'reviewing'),
  ('@my_account_3', 120000, 'user3@example.com', NULL, 'approved')
ON CONFLICT (id) DO NOTHING;

-- ===================================
-- 確認クエリ
-- ===================================
SELECT COUNT(*) as account_count FROM accounts;
SELECT COUNT(*) as request_count FROM purchase_requests;
