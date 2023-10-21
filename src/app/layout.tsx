import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

import { Analytics } from '@vercel/analytics/react';
import {
  PHProvider,
  PostHogPageview,
} from '@/components/contexts/posthog-provider';
import PosthogIdentify from '@/components/posthog-identify';
import { Suspense } from 'react';

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
        <PostHogPageview /> {/* https://posthog.com/docs/libraries/next-js */}
      </Suspense>
      <PHProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <body className={inter.className}>
            {children}
            <Analytics />
            <PosthogIdentify />
          </body>
        </ThemeProvider>
      </PHProvider>
    </html>
  );
}
