import { useNavigate } from '@tanstack/react-router'
import { Bell, Check, CreditCard, Globe, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LANGUAGE } from '@/enum/language'
import { ROUTES } from '@/enum/routes'
import type { IUserProfileDetail } from '@/interface/auth'
import { getCurrentLanguage, getTranslations, setCurrentLanguage } from '@/lib/translation'
import { useLogoutMutation } from '@/queries/use-auth-query'

const t = getTranslations()

function profileInitials(name: string | undefined): string {
  if (!name?.trim()) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const first = parts[0][0] ?? ''
  const last = parts[parts.length - 1][0] ?? ''
  return (first + last).toUpperCase()
}

export function ProfileDropdownComponent({ user }: { user?: IUserProfileDetail }) {
  const navigate = useNavigate()
  const { mutateAsync: logout } = useLogoutMutation()
  const currentLanguage = getCurrentLanguage()

  const avatarSrc = user?.image_url?.trim() ? user.image_url : undefined
  const initials = profileInitials(user?.name)

  const handleLogout = async () => {
    await logout()
  }

  const handleLanguageChange = (language: LANGUAGE) => {
    setCurrentLanguage(language)
    window.location.reload()
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <span className="sr-only">{t.header_notifications()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>{t.header_notifications()}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t.header_no_notifications()}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="size-8">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt={user?.name ?? ''} /> : null}
              <AvatarFallback delayMs={avatarSrc ? 200 : 0}>
                {initials || <User className="size-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {user ? (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          ) : null}
          <DropdownMenuItem onClick={() => navigate({ to: ROUTES.SETTINGS as string })}>
            <Settings className="mr-2 size-4" />
            {t.header_settings()}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: ROUTES.SUBSCRIPTIONS as string })}>
            <CreditCard className="mr-2 size-4" />
            {t.header_subscriptions()}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Globe className="mr-2 size-4" />
              {t.header_language()}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleLanguageChange(LANGUAGE.EN)}>
                  {t.header_language_en()}
                  {currentLanguage === LANGUAGE.EN && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange(LANGUAGE.VI)}>
                  {t.header_language_vi()}
                  {currentLanguage === LANGUAGE.VI && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            {t.header_logout()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
