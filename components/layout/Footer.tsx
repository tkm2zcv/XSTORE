/**
 * Footer Component
 *
 * Site-wide footer with links and copyright
 *
 * Features:
 * - Responsive grid layout
 * - External links to LINE and Twitter
 * - Internal navigation links
 *
 * Accessibility:
 * - Semantic <footer> element
 * - Proper link descriptions
 * - rel="noopener noreferrer" for external links
 */

import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-bold">
              <span className="text-primary">Twitter</span> Account Market
            </h3>
            <p className="text-sm text-muted-foreground">
              Twitterアカウントの買取・販売を安心・安全に行えるプラットフォーム
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/accounts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  販売中アカウント
                </Link>
              </li>
              <li>
                <Link
                  href="/purchase"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  買取申込
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">お問い合わせ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_LINE_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  公式LINE
                </a>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_TWITTER_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} Twitter Account Market. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
