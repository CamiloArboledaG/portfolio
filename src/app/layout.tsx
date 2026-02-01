import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const baseUrl = 'https://portfolio-camiloarboledags-projects.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Camilo Arboleda | Full Stack Developer',
  description:
    'Full Stack Developer based in Cali, Colombia. Specializing in React, Next.js, React Native, Go, and modern web technologies.',
  keywords: [
    'Full Stack Developer',
    'React',
    'Next.js',
    'React Native',
    'Go',
    'TypeScript',
    'Colombia',
    'Software Engineer',
    'Web Developer',
  ],
  authors: [{ name: 'Camilo Arboleda', url: baseUrl }],
  creator: 'Camilo Arboleda',
  openGraph: {
    title: 'Camilo Arboleda | Full Stack Developer',
    description:
      'Full Stack Developer based in Cali, Colombia. Specializing in React, Next.js, React Native, Go, and modern web technologies.',
    url: baseUrl,
    siteName: 'Camilo Arboleda Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Camilo Arboleda - Full Stack Developer',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Camilo Arboleda | Full Stack Developer',
    description:
      'Full Stack Developer based in Cali, Colombia. Specializing in React, Next.js, React Native, Go, and modern web technologies.',
    creator: '@camilo_arbga',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
