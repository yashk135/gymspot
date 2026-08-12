import type { Metadata, Viewport } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { PwaInstallPrompt } from '@/components/shared/PwaInstallPrompt';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: 'GymSpot — Find Your Gym, Own Your Fitness',
  description:
    'Global SaaS marketplace for gym discovery, side-by-side comparison, and instant free trial bookings.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1A1A2E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-[#1A1A2E] text-white font-sans antialiased selection:bg-[#FF5722] selection:text-white">
        <Providers>
          {children}
          <PwaInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
