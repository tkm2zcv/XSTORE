/**
 * 初期データセットアップスクリプト
 * 管理者アカウントとサンプルデータを一括で挿入
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ エラー: Supabaseの設定が見つかりません')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupInitialData() {
  console.log('🚀 初期データセットアップを開始します...\n')
  console.log('=' .repeat(70))

  try {
    // ===================================
    // 1. 管理者アカウント作成
    // ===================================
    console.log('\n👤 管理者アカウントを作成中...')

    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .upsert({
        email: 'admin@xstore.com',
        password_hash: '$2a$10$jlwdoAYsjtq7YA0vDiAw3esoE8BWBkibElogF/VV7B9RRUlJ9KB7m',
        name: 'XSTORE管理者'
      }, {
        onConflict: 'email'
      })
      .select()

    if (adminError) {
      console.error('   ❌ エラー:', adminError.message)
    } else {
      console.log('   ✅ 管理者アカウント作成完了')
      console.log('   📧 Email: admin@xstore.com')
      console.log('   🔑 Password: admin123')
    }

    // ===================================
    // 2. サンプルアカウント挿入
    // ===================================
    console.log('\n📊 サンプルアカウントを挿入中...')

    const sampleAccounts = [
      {
        username: '@business_pro',
        followers_count: 50000,
        tweets_count: 12000,
        account_created_date: '2020-01-15',
        price: 150000,
        category: 'ビジネス',
        description: 'ビジネス系フォロワー多数。エンゲージメント率高め。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=business1&backgroundColor=0ea5e9'
      },
      {
        username: '@entertainment_star',
        followers_count: 120000,
        tweets_count: 35000,
        account_created_date: '2018-06-20',
        price: 300000,
        category: 'エンタメ',
        description: 'エンタメ系人気アカウント。若年層フォロワー中心。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=entertainment1&backgroundColor=ec4899'
      },
      {
        username: '@news_update',
        followers_count: 80000,
        tweets_count: 25000,
        account_created_date: '2019-03-10',
        price: 200000,
        category: 'ニュース',
        description: 'ニュース速報アカウント。リツイート率が非常に高い。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=news1&backgroundColor=ef4444'
      },
      {
        username: '@sports_fan',
        followers_count: 45000,
        tweets_count: 8000,
        account_created_date: '2021-02-28',
        price: 120000,
        category: 'スポーツ',
        description: 'スポーツファン向けアカウント。週末の投稿が人気。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sports1&backgroundColor=f97316'
      },
      {
        username: '@tech_guru',
        followers_count: 95000,
        tweets_count: 18000,
        account_created_date: '2019-09-05',
        price: 250000,
        category: 'テクノロジー',
        description: 'IT・テック系情報発信。エンジニアフォロワー多数。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech1&backgroundColor=8b5cf6'
      },
      {
        username: '@lifestyle_tips',
        followers_count: 65000,
        tweets_count: 15000,
        account_created_date: '2020-07-12',
        price: 180000,
        category: 'その他',
        description: 'ライフスタイル提案アカウント。女性フォロワー中心。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=other1&backgroundColor=a855f7'
      },
      {
        username: '@business_news',
        followers_count: 110000,
        tweets_count: 28000,
        account_created_date: '2018-11-01',
        price: 280000,
        category: 'ビジネス',
        description: 'ビジネスニュース専門。経営者層に人気。',
        status: 'sold',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=business2&backgroundColor=0ea5e9'
      },
      {
        username: '@movie_review',
        followers_count: 75000,
        tweets_count: 22000,
        account_created_date: '2019-05-18',
        price: 190000,
        category: 'エンタメ',
        description: '映画レビューアカウント。週末の投稿で高エンゲージメント。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=entertainment2&backgroundColor=ec4899'
      },
      {
        username: '@code_daily',
        followers_count: 55000,
        tweets_count: 11000,
        account_created_date: '2020-10-22',
        price: 140000,
        category: 'テクノロジー',
        description: 'プログラミング学習アカウント。初心者向けコンテンツ。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech2&backgroundColor=8b5cf6'
      },
      {
        username: '@soccer_love',
        followers_count: 40000,
        tweets_count: 9500,
        account_created_date: '2021-04-08',
        price: 110000,
        category: 'スポーツ',
        description: 'サッカー専門アカウント。試合実況で人気。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sports2&backgroundColor=f97316'
      },
      {
        username: '@startup_jp',
        followers_count: 88000,
        tweets_count: 16000,
        account_created_date: '2019-12-03',
        price: 230000,
        category: 'ビジネス',
        description: 'スタートアップ情報。投資家フォロワー多数。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=business3&backgroundColor=0ea5e9'
      },
      {
        username: '@fashion_daily',
        followers_count: 130000,
        tweets_count: 42000,
        account_created_date: '2018-08-15',
        price: 320000,
        category: 'その他',
        description: 'ファッション情報アカウント。インフルエンサー級。',
        status: 'available',
        image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=other2&backgroundColor=a855f7'
      }
    ]

    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .insert(sampleAccounts)
      .select()

    if (accountsError) {
      console.error('   ❌ エラー:', accountsError.message)
    } else {
      console.log(`   ✅ サンプルアカウント ${accountsData.length} 件 挿入完了`)
    }

    // ===================================
    // 3. サンプル買取申込挿入
    // ===================================
    console.log('\n📝 サンプル買取申込を挿入中...')

    const sampleRequests = [
      {
        twitter_username: '@my_account_1',
        desired_price: 50000,
        contact_email: 'user1@example.com',
        contact_twitter: '@user1_contact',
        status: 'pending'
      },
      {
        twitter_username: '@my_account_2',
        desired_price: 80000,
        contact_email: 'user2@example.com',
        contact_twitter: '@user2_contact',
        status: 'reviewing'
      },
      {
        twitter_username: '@my_account_3',
        desired_price: 120000,
        contact_email: 'user3@example.com',
        status: 'approved'
      }
    ]

    const { data: requestsData, error: requestsError } = await supabase
      .from('purchase_requests')
      .insert(sampleRequests)
      .select()

    if (requestsError) {
      console.error('   ❌ エラー:', requestsError.message)
    } else {
      console.log(`   ✅ サンプル買取申込 ${requestsData.length} 件 挿入完了`)
    }

    // ===================================
    // 4. 結果確認
    // ===================================
    console.log('\n' + '=' .repeat(70))
    console.log('✅ セットアップ完了！\n')
    console.log('📊 データベース状況:')

    const { count: adminCount } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true })
    console.log(`   - 管理者: ${adminCount} 件`)

    const { count: accountCount } = await supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true })
    console.log(`   - アカウント: ${accountCount} 件`)

    const { count: requestCount } = await supabase
      .from('purchase_requests')
      .select('*', { count: 'exact', head: true })
    console.log(`   - 買取申込: ${requestCount} 件`)

    console.log('\n🎉 今すぐログインできます！')
    console.log('=' .repeat(70))
    console.log('\n🔐 ログイン情報:')
    console.log('   URL: http://localhost:3030/login')
    console.log('   メールアドレス: admin@xstore.com')
    console.log('   パスワード: admin123')
    console.log('\n' + '=' .repeat(70) + '\n')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message)
    process.exit(1)
  }
}

setupInitialData()
