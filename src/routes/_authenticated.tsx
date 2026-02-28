import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthLayout } from '@/components/layouts/AuthLayout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
