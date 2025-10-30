/**
 * Supabaseデータベースの状況確認スクリプト
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ エラー: Supabaseの設定が見つかりません')
  console.error('   .env.local ファイルを確認してください')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Supabaseデータベースの状況を確認中...\n')
  console.log('=' .repeat(70))

  // accounts テーブルチェック
  console.log('\n📊 accounts テーブル:')
  try {
    const { data, error, count } = await supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true })

    if (error) {
      if (error.code === '42P01') {
        console.log('   ❌ テーブルが存在しません')
        console.log('   → supabase-setup.sql を実行してください')
      } else {
        console.log(`   ⚠️  エラー: ${error.message}`)
      }
    } else {
      console.log(`   ✅ テーブルが存在します`)
      console.log(`   📝 レコード数: ${count || 0} 件`)
    }
  } catch (e) {
    console.log(`   ❌ 接続エラー: ${e.message}`)
  }

  // purchase_requests テーブルチェック
  console.log('\n📝 purchase_requests テーブル:')
  try {
    const { data, error, count } = await supabase
      .from('purchase_requests')
      .select('*', { count: 'exact', head: true })

    if (error) {
      if (error.code === '42P01') {
        console.log('   ❌ テーブルが存在しません')
      } else {
        console.log(`   ⚠️  エラー: ${error.message}`)
      }
    } else {
      console.log(`   ✅ テーブルが存在します`)
      console.log(`   📝 レコード数: ${count || 0} 件`)
    }
  } catch (e) {
    console.log(`   ❌ 接続エラー: ${e.message}`)
  }

  // admins テーブルチェック
  console.log('\n👤 admins テーブル:')
  try {
    const { data, error, count } = await supabase
      .from('admins')
      .select('email, name, created_at', { count: 'exact' })

    if (error) {
      if (error.code === '42P01') {
        console.log('   ❌ テーブルが存在しません')
      } else {
        console.log(`   ⚠️  エラー: ${error.message}`)
      }
    } else {
      console.log(`   ✅ テーブルが存在します`)
      console.log(`   📝 管理者数: ${count || 0} 件`)
      if (data && data.length > 0) {
        console.log('\n   登録済み管理者:')
        data.forEach((admin, index) => {
          console.log(`   ${index + 1}. ${admin.email} (${admin.name})`)
        })
      }
    }
  } catch (e) {
    console.log(`   ❌ 接続エラー: ${e.message}`)
  }

  console.log('\n' + '=' .repeat(70))
  console.log('\n📋 次にやること:\n')

  const { data: adminsData } = await supabase
    .from('admins')
    .select('*', { count: 'exact', head: true })
    .catch(() => ({ data: null }))

  const { data: accountsData } = await supabase
    .from('accounts')
    .select('*', { count: 'exact', head: true })
    .catch(() => ({ data: null }))

  if (!accountsData) {
    console.log('1. ❌ データベーステーブルを作成')
    console.log('   → supabase-setup.sql をSupabase SQL Editorで実行')
    console.log('')
  } else {
    console.log('1. ✅ データベーステーブル作成済み')
  }

  if (!adminsData) {
    console.log('2. ❌ 管理者アカウントを作成')
    console.log('   → node scripts/hash-password.js admin123')
    console.log('   → 生成されたSQLをSupabaseで実行')
    console.log('')
  } else {
    console.log('2. ✅ 管理者アカウント作成済み')
    console.log('   → http://localhost:3030/login でログインできます')
  }

  console.log('\n詳細は SETUP_CHECKLIST.md を確認してください\n')
}

checkDatabase().catch(console.error)
