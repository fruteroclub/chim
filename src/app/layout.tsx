import '@/styles/globals.css'

import { Inter } from 'next/font/google'

import { TRPCReactProvider } from '@/trpc/react'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

import WalletProvider from '../providers/WalletProvider'
import Navbar from '@/components/layout/navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'chim',
  description: 'Chad Index Manager',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('bg-background min-h-screen font-sans antialiased', inter.variable)}>
        <WalletProvider>
          <TRPCReactProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </TRPCReactProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
