import { useCallback, useRef, useState } from 'react'
import AppDialogComponent from '@/components/reusable/app-dialog/app-dialog-component'
import { AppSelectComponent } from '@/components/reusable/app-select-component/app-select-component'
import CreateGroupForm, {
  type CreateGroupFormHandle,
} from '@/components/reusable/create-group-dialog/create-group-dialog'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserStatus } from '@/enum/users'
import type { IOption } from '@/interface/utils'
import { getTranslations } from '@/lib/translation'
import { useProfileQuery, useTrackSessionQuery } from '@/queries/use-auth-query'
import { ProfileDropdownComponent } from './ProfileDropdownComponent'

const InitialIcon = ({ label }: { label: string }) => (
  <span className="flex size-5 items-center justify-center rounded-md bg-[#bf360b] text-[10px] font-semibold text-primary-foreground">
    {label.charAt(0).toUpperCase()}
  </span>
)

const MOCK_OPTIONS: IOption[] = [
  { label: 'Engineering', value: 'engineering', icon: <InitialIcon label="Engineering" /> },
  { label: 'Design', value: 'design', icon: <InitialIcon label="Design" /> },
  { label: 'Marketing', value: 'marketing', icon: <InitialIcon label="Marketing" /> },
  { label: 'Sales', value: 'sales', icon: <InitialIcon label="Sales" /> },
  { label: 'Support', value: 'support', icon: <InitialIcon label="Support" /> },
]

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
  const [selectedTeam, setSelectedTeam] = useState<IOption | null>(null)
  const [searchValue, setSearchValue] = useState('')
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

        <AppSelectComponent
          options={MOCK_OPTIONS.filter((option) =>
            option.label.toLowerCase().includes(searchValue.toLowerCase()),
          )}
          value={selectedTeam}
          onChange={setSelectedTeam}
          placeholder="Select team..."
          className="w-48"
          searchable
          onSearchChange={(value) => setSearchValue(value)}
        />

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
