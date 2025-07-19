import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SITE_NAME = 'PhonePe Payment Gateway | Next.js Integration';
const SITE_DESCRIPTION =
  'Secure payment processing with PhonePe Payment Gateway integration built with Next.js, TypeScript, and modern React UI';
const SITE_IMAGE = `${SITE_URL}/og.png`;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'PhonePe',
    'Payment Gateway',
    'Next.js',
    'TypeScript',
    'React',
    'Online Payments',
    'Digital Payments',
    'UPI',
    'India',
    'eCommerce',
  ],
  authors: [{ name: 'rnxj', url: 'https://rnxj.dev' }],
  creator: 'rnxj',
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
        type: 'image/png',
        secureUrl: SITE_IMAGE.replace('http:', 'https:'),
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE],
    creator: '@rnxj',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// Define the JSON-LD schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta property="og:image" content={SITE_IMAGE} />
        <meta
          property="og:image:secure_url"
          content={SITE_IMAGE.replace('http:', 'https:')}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={SITE_NAME} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col h-full">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="w-full py-4">
              <div className="container mx-auto max-w-7xl px-6 flex items-center justify-center">
                <a
                  href="https://rnxj.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span>Built with</span>
                  <span className="group-hover:scale-110 transition-transform">
                    ❤️
                  </span>
                  <span>by</span>
                  <span className="font-medium underline underline-offset-4">
                    rnxj.dev
                  </span>
                </a>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
