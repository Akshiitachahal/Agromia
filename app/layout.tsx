import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SplashCursor from '@/components/ui/SplashCursor';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://agromia.com'),
  title: {
    default: 'AGROMIA — Smart Crop Protection Solutions',
    template: '%s | AGROMIA',
  },
  description:
    'AGROMIA represents reliable crop protection products and agricultural solutions for farmers, dealers, distributors and agricultural partners across India.',
  keywords: ['AGROMIA', 'crop protection', 'fungicides', 'insecticides', 'seed treatment', 'agricultural products', 'India'],
  authors: [{ name: 'AGROMIA LLP' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'AGROMIA',
    title: 'AGROMIA — Smart Crop Protection Solutions',
    description: 'Premium agricultural products for better crops and stronger yields.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGROMIA — Smart Crop Protection Solutions',
    description: 'Premium agricultural products for better crops and stronger yields.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
      >
        <I18nProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <SplashCursor />
        </I18nProvider>
      </body>
    </html>
  );
}
