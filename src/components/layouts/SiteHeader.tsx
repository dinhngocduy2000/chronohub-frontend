import { useCallback, useRef, useState } from 'react'
import AppDialogComponent from '@/components/reusable/app-dialog/app-dialog-component'
import CreateGroupForm, {
  type CreateGroupFormHandle,
} from '@/components/reusable/create-group-dialog/create-group-dialog'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserStatus } from '@/enum/users'
import { getTranslations } from '@/lib/translation'
import { useProfileQuery, useTrackSessionQuery } from '@/queries/use-auth-query'
import { ProfileDropdownComponent } from './ProfileDropdownComponent'

const t = getTranslations()

export function SiteHeader() {
  useTrackSessionQuery()
  const { data: profileResponse } = useProfileQuery()
  const user = profileResponse?.data
  const showCreateGroupDialog = profileResponse?.data?.status === UserStatus.PENDING
  const [dialogOpen, setDialogOpen] = useState(showCreateGroupDialog)
  const formRef = useRef<CreateGroupFormHandle>(null)
  const isFormDirtyRef = useRef(false)
  const [formState, setFormState] = useState({ isValid: false, isPending: false, isDirty: false })

  const handleFormStateChange = useCallback(
    (state: { isValid: boolean; isPending: boolean; isDirty: boolean }) => {
      isFormDirtyRef.current = state.isDirty
      setFormState(state)
    },
    [],
  )

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

        <span className="text-lg font-semibold">{t.app_name()}</span>

        <ProfileDropdownComponent user={user} />
      </header>

      <AppDialogComponent
        open={dialogOpen || showCreateGroupDialog}
        setOpen={setDialogOpen}
        dialogTrigger={null}
        header={false}
        confirmButtonText="Get Started"
        confirmButtonProps={{
          disabled: !formState.isValid || formState.isPending,
          loading: formState.isPending,
          className: 'w-full',
        }}
        cancelButtonProps={{ className: 'hidden' }}
        onConfirm={() => formRef.current?.submit()}
        isFormDirtyRef={isFormDirtyRef}
        disableClickOverlay
      >
        <CreateGroupForm
          ref={formRef}
          closeModal={() => setDialogOpen(false)}
          onFormStateChange={handleFormStateChange}
        />
      </AppDialogComponent>
    </>
  )
}
