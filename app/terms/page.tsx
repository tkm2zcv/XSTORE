import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: '利用規約 | XSTORE',
  description: 'XSTOREの利用規約',
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">利用規約</CardTitle>
          <p className="text-sm text-muted-foreground">
            最終更新日: {new Date().toLocaleDateString('ja-JP')}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第1条（適用）</h2>
            <p className="leading-relaxed text-muted-foreground">
              本利用規約（以下「本規約」といいます）は、当サイト「XSTORE」（以下「当サイト」といいます）が提供するサービス（以下「本サービス」といいます）の利用条件を定めるものです。
              利用者の皆様（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第2条（利用登録）</h2>
            <p className="leading-relaxed text-muted-foreground">
              本サービスにおいては、管理者による認証が必要な機能と、一般ユーザーが利用可能な機能があります。
              管理者機能の利用には、当サイトが定める方法によって利用登録を行う必要があります。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第3条（禁止事項）</h2>
            <p className="leading-relaxed text-muted-foreground">
              ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>虚偽の情報を登録する行為</li>
              <li>
                他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為
              </li>
              <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
              <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正な目的を持って本サービスを利用する行為</li>
              <li>
                本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為
              </li>
              <li>
                当サイトのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
              </li>
              <li>その他、当サイトが不適切と判断する行為</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第4条（本サービスの提供の停止等）</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
              <li>
                地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
              </li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、当サイトが本サービスの提供が困難と判断した場合</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第5条（免責事項）</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
              ただし、本サービスに関する当サイトとユーザーとの間の契約（本規約を含みます）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第6条（サービス内容の変更等）</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第7条（利用規約の変更）</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
              なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第8条（個人情報の取扱い）</h2>
            <p className="leading-relaxed text-muted-foreground">
              当サイトは、本サービスの利用によって取得する個人情報については、当サイト「プライバシーポリシー」に従い適切に取り扱うものとします。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">第9条（準拠法・裁判管轄）</h2>
            <p className="leading-relaxed text-muted-foreground">
              本規約の解釈にあたっては、日本法を準拠法とします。
            </p>
            <p className="leading-relaxed text-muted-foreground">
              本サービスに関して紛争が生じた場合には、当サイトの所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>

          <div className="mt-8 text-right text-sm text-muted-foreground">以上</div>
        </CardContent>
      </Card>
    </div>
  )
}
