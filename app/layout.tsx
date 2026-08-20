import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Plus_Jakarta_Sans, Noto_Serif_Devanagari, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SplashCursor from '@/components/ui/SplashCursor';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hero-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-hero-sans',
  display: 'swap',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-devanagari-sans',
  display: 'swap',
});

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
        className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${manrope.variable} ${notoSerifDevanagari.variable} ${notoSansDevanagari.variable} font-sans antialiased`}
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
