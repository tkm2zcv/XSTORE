import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | XSTORE',
  description: 'XSTOREのプライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">プライバシーポリシー</CardTitle>
          <p className="text-sm text-muted-foreground">
            最終更新日: {new Date().toLocaleDateString('ja-JP')}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. はじめに</h2>
            <p className="leading-relaxed text-muted-foreground">
              XSTORE（以下「当サイト」）は、ユーザーの個人情報の重要性を認識し、個人情報の保護に関する法律（以下「個人情報保護法」）を遵守するとともに、以下のプライバシーポリシー（以下「本ポリシー」）に従って、適切な取り扱いおよび保護に努めます。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. 個人情報の定義</h2>
            <p className="leading-relaxed text-muted-foreground">
              本ポリシーにおいて「個人情報」とは、個人情報保護法第2条第1項により定義された個人情報、すなわち、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む）を意味するものとします。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. 個人情報の収集方法</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、ユーザーが以下の情報を提供する際に個人情報を収集します。
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>買取申込フォームの送信時（Twitter ID、連絡先など）</li>
              <li>お問い合わせフォームの送信時（氏名、メールアドレスなど）</li>
              <li>管理者アカウントの登録時（メールアドレス、パスワードなど）</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. 個人情報の利用目的</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、収集した個人情報を以下の目的で利用します。
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>本サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため</li>
              <li>買取申込の処理および連絡のため</li>
              <li>メンテナンス、重要なお知らせなど必要に応じた連絡のため</li>
              <li>
                利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
              </li>
              <li>
                ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
              </li>
              <li>本サービスの改善、新サービスの開発のため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. 個人情報の第三者提供</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>法令に基づく場合</li>
              <li>
                人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
              </li>
              <li>
                公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
              </li>
              <li>
                国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. 個人情報の管理</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、個人情報の正確性を保ち、これを安全に管理します。個人情報への不正アクセス、紛失、破壊、改ざんおよび漏洩などを防止するため、必要かつ適切な安全管理措置を講じます。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Cookieの使用について</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトでは、ユーザーの利便性向上のためCookieを使用することがあります。
              Cookieとは、ウェブサーバーからブラウザに送信されるデータのことで、ユーザーのコンピュータに記録されます。
              Cookieには個人を特定する情報は含まれません。
            </p>
            <p className="leading-relaxed text-muted-foreground">
              ブラウザの設定によりCookieの受け取りを拒否することができますが、その場合、本サービスの一部機能が正常に動作しない可能性があります。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. アクセス解析ツールについて</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトでは、Googleアナリティクス等のアクセス解析ツールを使用することがあります。
              これらのツールはトラフィックデータの収集のためにCookieを使用しています。
              このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. 個人情報の開示・訂正・削除</h2>
            <p className="leading-relaxed text-muted-foreground">
              ユーザーは、当サイトに対して、個人情報保護法の定めに従い、個人情報の開示を請求することができます。
              個人情報の内容に誤りがある場合は、訂正または削除を請求することができます。
            </p>
            <p className="leading-relaxed text-muted-foreground">
              開示、訂正、削除をご希望される場合は、当サイトのお問い合わせフォームよりご連絡ください。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">10. プライバシーポリシーの変更</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、必要に応じて、本ポリシーを変更することがあります。
              変更後のプライバシーポリシーは、当サイトに掲載したときから効力を生じるものとします。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">11. お問い合わせ</h2>
            <p className="leading-relaxed text-muted-foreground">
              本ポリシーに関するお問い合わせは、当サイトのお問い合わせフォーム、またはLINE・Twitterよりご連絡ください。
            </p>
          </section>

          <div className="mt-8 text-right text-sm text-muted-foreground">以上</div>
        </CardContent>
      </Card>
    </div>
  )
}
