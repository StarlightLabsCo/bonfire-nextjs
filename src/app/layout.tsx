import './globals.css';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { PHProvider, PostHogPageview } from '@/components/posthog-provider';
import { PosthogIdentify } from '@/components/posthog-identify';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

import SessionProvider from '@/components/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bonfire',
  description: 'Created by Starlight Labs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <SessionProvider>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Analytics />
              <PosthogIdentify />
            </ThemeProvider>
          </body>
        </SessionProvider>
      </PHProvider>
    </html>
  );
}
