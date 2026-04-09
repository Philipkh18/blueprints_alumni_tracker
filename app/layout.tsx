import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alumni Tracker',
  description: 'Blueprints alumni directory',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
