import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PhonePe Payment Gateway | Next.js Integration',
  description:
    'Secure payment processing with PhonePe Payment Gateway integration built with Next.js, TypeScript, and modern React UI',
  openGraph: {
    title: 'PhonePe Payment Gateway | Next.js Integration',
    description:
      'Secure payment processing with PhonePe Payment Gateway integration built with Next.js, TypeScript, and modern React UI',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'PhonePe Payment Gateway Integration with Next.js',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhonePe Payment Gateway | Next.js Integration',
    description:
      'Secure payment processing with PhonePe Payment Gateway integration built with Next.js, TypeScript, and modern React UI',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
