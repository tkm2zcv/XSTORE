import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { WebVitals } from '@/components/web-vitals'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'XSTORE - Twitterアカウント買取・販売プラットフォーム',
    template: '%s | XSTORE',
  },
  description: '安心・安全にTwitterアカウントの売買ができるプロフェッショナルなマーケットプレイス。豊富な取扱アカウントから選べます。',
  keywords: ['Twitter', 'アカウント', '買取', '販売', 'SNS', 'マーケットプレイス'],
  authors: [{ name: 'XSTORE' }],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://xstore.com',
    siteName: 'XSTORE',
    title: 'XSTORE - Twitterアカウント買取・販売プラットフォーム',
    description: '安心・安全にTwitterアカウントの売買ができるプロフェッショナルなマーケットプレイス',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XSTORE - Twitterアカウント買取・販売プラットフォーム',
    description: '安心・安全にTwitterアカウントの売買ができるプロフェッショナルなマーケットプレイス',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <WebVitals />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
