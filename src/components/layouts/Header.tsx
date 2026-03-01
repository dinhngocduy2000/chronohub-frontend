import { useLogoutMutation, useTrackSessionQuery } from '@/queries/use-auth-query'
import { Button } from '../ui/button'

export function Header() {
  useTrackSessionQuery()
  const { mutateAsync: logout } = useLogoutMutation()
  const handleLogout = async () => {
    await logout()
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold">ChronoHub</span>
          </a>
        </div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  )
}
