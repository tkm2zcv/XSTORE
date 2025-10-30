const bcrypt = require('bcryptjs');

// コマンドライン引数から取得
const password = process.argv[2];
const email = process.argv[3] || 'admin@example.com';
const name = process.argv[4] || 'Admin User';

if (!password) {
  console.error('\n❌ エラー: パスワードが指定されていません\n');
  console.log('使い方:');
  console.log('  node scripts/hash-password.js <パスワード> [メールアドレス] [名前]\n');
  console.log('例:');
  console.log('  node scripts/hash-password.js password123');
  console.log('  node scripts/hash-password.js password123 admin@xstore.com "管理者"\n');
  process.exit(1);
}

// セキュリティチェック
if (password.length < 8) {
  console.warn('\n⚠️  警告: パスワードが短すぎます（8文字以上を推奨）\n');
}

if (!email.includes('@')) {
  console.error('\n❌ エラー: 有効なメールアドレスを指定してください\n');
  process.exit(1);
}

// bcryptでパスワードをハッシュ化（ソルトラウンド: 10）
console.log('\n⏳ パスワードをハッシュ化しています...\n');
const hash = bcrypt.hashSync(password, 10);

// 結果を表示
console.log('='.repeat(70));
console.log('✅ パスワードハッシュ生成完了');
console.log('='.repeat(70));
console.log('\n📝 元のパスワード:');
console.log(`   ${password}`);
console.log('\n🔐 ハッシュ化されたパスワード:');
console.log(`   ${hash}`);
console.log('\n' + '='.repeat(70));
console.log('📋 Supabaseに管理者を追加するSQL');
console.log('='.repeat(70));
console.log(`
-- Supabase SQL Editorで以下のSQLを実行してください

INSERT INTO admins (email, password_hash, name)
VALUES (
  '${email}',
  '${hash}',
  '${name}'
)
ON CONFLICT (email)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name;

-- 実行後、以下のクエリで確認できます
SELECT id, email, name, created_at FROM admins;
`);
console.log('='.repeat(70));
console.log('\n💡 次のステップ:');
console.log('   1. Supabase Dashboard (https://supabase.com/dashboard) にログイン');
console.log('   2. プロジェクトを選択');
console.log('   3. 左メニューから "SQL Editor" を選択');
console.log('   4. 上記のSQLをコピー＆ペースト');
console.log('   5. メールアドレスと名前を変更');
console.log('   6. "Run" ボタンをクリック');
console.log('\n🔑 ログイン情報:');
console.log(`   URL: http://localhost:3030/login`);
console.log(`   メールアドレス: ${email}`);
console.log(`   パスワード: ${password}`);
console.log('\n⚠️  重要: このパスワードは安全に保管してください！');
console.log('\n' + '='.repeat(70) + '\n');
