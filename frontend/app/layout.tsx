import { GoogleAnalytics } from '@next/third-parties/google';
import { Settings } from 'luxon';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@/styles/globals.css';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';

import { CONSTANTS } from '@/lib/constants';
import { env } from '@/lib/env';

Settings.defaultZone = 'Asia/Tokyo';
Settings.defaultLocale = 'ja-JP';

if (process.env.NEXT_RUNTIME === 'nodejs' && env.USE_MSW) {
  const { server } = await import('@/mocks/server');
  server.listen();
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const description = '現在の天気をライブストリームから取得した情報で確認できます';
export const metadata: Metadata = {
  title: {
    template: '%s - ' + CONSTANTS.APP_NAME,
    default: CONSTANTS.APP_NAME,
  },
  description,
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  openGraph: {
    images: ['/og'],
    title: CONSTANTS.APP_NAME,
    description,
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
          <div className='min-h-screen flex flex-col p-4 bg-background items-center'>
            <Header />
            <main className='flex-1 w-full max-w-7xl'>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
