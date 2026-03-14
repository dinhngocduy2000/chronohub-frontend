import { useNavigate } from '@tanstack/react-router'
import { Bell, Check, CreditCard, Globe, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LANGUAGE } from '@/enum/language'
import { ROUTES } from '@/enum/routes'
import { getCurrentLanguage, getTranslations, setCurrentLanguage } from '@/lib/translation'
import { useLogoutMutation, useTrackSessionQuery } from '@/queries/use-auth-query'

const t = getTranslations()

export function SiteHeader() {
  useTrackSessionQuery()
  const navigate = useNavigate()
  const { mutateAsync: logout } = useLogoutMutation()
  const currentLanguage = getCurrentLanguage()

  const handleLogout = async () => {
    await logout()
  }

  const handleLanguageChange = (language: LANGUAGE) => {
    setCurrentLanguage(language)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

      <span className="text-lg font-semibold">{t.app_name()}</span>

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
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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
    </header>
  )
}
