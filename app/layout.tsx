import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Blueprints for Pangaea Alumni Hub',
    template: '%s | Blueprints for Pangaea',
  },
  description: 'Directory, updates, and opportunities for the Blueprints for Pangaea alumni network.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
