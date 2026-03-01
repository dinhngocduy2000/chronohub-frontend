import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { KEY_STORAGE } from '@/enum/key-storage'
import { ROUTES } from '@/enum/routes'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleLogout = () => {
  window.location.replace(ROUTES.LOGIN)
  localStorage.removeItem(KEY_STORAGE.IS_LOGGED_IN)
  localStorage.removeItem(KEY_STORAGE.IS_SAVE_SESSION)
}
