import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cоціальна платформа для мешканців міста Харків',
  description: 'Соціальна платформа для мешканців міста Харків',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          {children}
          <SpeedInsights />
          <Analytics />
        </main>
      </body>
    </html>
  )
}
