import type { ReactNode } from 'react'
import Image from 'next/image'

export default function AuthFrame({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="flex w-full max-w-md flex-col items-center justify-center text-center">
          <Image
            src="/brand/blueprints-logo.png"
            alt="Blueprints for Pangaea"
            width={936}
            height={556}
            priority
            className="mb-8 h-auto w-full max-w-[14rem]"
          />
          <div className="flex w-full justify-center">{children}</div>
        </section>
      </div>
    </main>
  )
}
