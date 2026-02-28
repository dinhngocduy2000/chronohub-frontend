import { createFileRoute, Outlet } from '@tanstack/react-router'
import { GuestLayout } from '@/components/layouts/GuestLayout'

export const Route = createFileRoute('/_guest')({
  component: GuestLayoutRoute,
})

function GuestLayoutRoute() {
  return (
    <GuestLayout>
      <Outlet />
    </GuestLayout>
  )
}
