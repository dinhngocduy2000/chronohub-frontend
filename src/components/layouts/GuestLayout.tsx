import type { ReactNode } from 'react'

interface GuestLayoutProps {
  children: ReactNode
}

export function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">{children}</main>
    </div>
  )
}
