import './globals.css';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stylehubdecors.co';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2A4A38',
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'StyleHub Decors — Curated Fashion & Home Decor', template: '%s | StyleHub Decors' },
  description: 'Handpicked Amazon fashion & home decor finds. Curated for taste. Shoppable instantly.',
  keywords: ['amazon fashion india', 'home decor amazon', 'room setup ideas', 'aesthetic decor', 'fashion under 999', 'pinterest fashion india'],
  authors: [{ name: 'StyleHub Decors' }],
  openGraph: {
    type: 'website',
    siteName: 'StyleHub Decors',
    locale: 'en_IN',
    url: siteUrl,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'StyleHub Decors' }],
  },
  twitter: { card: 'summary_large_image', site: '@stylehubdecors' },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${cormorant.variable} ${jakarta.variable}`}>
      <body className="bg-cream text-ink antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
