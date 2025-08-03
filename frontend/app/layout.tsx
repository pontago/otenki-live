import { Settings } from 'luxon';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@/styles/globals.css';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { env } from '@/lib/env';

Settings.defaultZone = 'Asia/Tokyo';
Settings.defaultLocale = 'ja-JP';

if (process.env.NEXT_RUNTIME === 'nodejs' && env.USE_MSW === true) {
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

export const metadata: Metadata = {
  title: {
    template: '%s - お天気ライブ',
    default: 'お天気ライブ',
  },
  description: '現在の天気をライブストリームから取得した情報で確認できます',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
          <div className='min-h-screen flex flex-col p-4 bg-background items-center'>
            <Header />
            <main className='flex-1 w-full max-w-7xl'>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
