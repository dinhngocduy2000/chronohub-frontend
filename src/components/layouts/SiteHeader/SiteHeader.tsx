import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CreateGroupForm, {
  type CreateGroupFormHandle,
} from '@/components/layouts/SiteHeader/create-group-dialog/create-group-dialog'
import AppDialogComponent from '@/components/reusable/app-dialog/app-dialog-component'
import { AppSelectComponent } from '@/components/reusable/app-select-component/app-select-component'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserStatus } from '@/enum/users'
import type { IOption } from '@/interface/utils'
import { getTranslations } from '@/lib/translation'
import { useProfileQuery, useTrackSessionQuery } from '@/queries/use-auth-query'
import { useChangeActiveGroupMutation, useListGroupKeyValueQuery } from '@/queries/use-groups-query'
import { ProfileDropdownComponent } from '../ProfileDropdownComponent'

const t = getTranslations()

export function SiteHeader() {
  useTrackSessionQuery()
  const [selectedTeam, setSelectedTeam] = useState<IOption | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const { data: profileResponse } = useProfileQuery()
  const { data: groupKeyValueListData } = useListGroupKeyValueQuery({
    params: null,
  })
  const user = profileResponse?.data
  const formRef = useRef<CreateGroupFormHandle>(null)
  const isFormDirtyRef = useRef(false)
  const [formState, setFormState] = useState({ isValid: false, isPending: false, isDirty: false })
  const [searchValue, setSearchValue] = useState('')
  const handleFormStateChange = useCallback(
    (state: { isValid: boolean; isPending: boolean; isDirty: boolean }) => {
      isFormDirtyRef.current = state.isDirty
      setFormState(state)
    },
    [],
  )

  const handleSearchTeam = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const { mutateAsync: changeActiveGroup } = useChangeActiveGroupMutation({})

  const handleChangeActiveGroup = async (group_id: string) => {
    if (!group_id) return
    if (group_id === user?.group_id) return
    await changeActiveGroup({ group_id })
  }
  const listGroupKeyValueWithIcon = useMemo(
    () =>
      (groupKeyValueListData?.data ?? [])
        .map((item) => ({
          ...item,
          icon: item.label,
        }))
        .filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase())),
    [groupKeyValueListData?.data, searchValue],
  )

  useEffect(
    function openCreateGroupDialog() {
      if (
        profileResponse?.data?.status === UserStatus.PENDING ||
        (profileResponse && !profileResponse?.data?.group_id)
      ) {
        setDialogOpen(true)
      }
    },
    [profileResponse],
  )

  useEffect(
    function setDefaultSelectedTeam() {
      const defaultGroup = profileResponse?.data?.group
      if (defaultGroup) {
        setSelectedTeam({
          ...defaultGroup,
          icon: defaultGroup.label,
        })
      }
    },
    [profileResponse],
  )
  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

        <span className="text-lg font-semibold">{t.app_name()}</span>

        <AppSelectComponent
          options={listGroupKeyValueWithIcon}
          value={selectedTeam}
          onChange={(value) => {
            handleChangeActiveGroup(value?.value ?? '')
          }}
          placeholder="Select team..."
          className="w-48"
          searchable
          onSearchChange={handleSearchTeam}
        />

        <ProfileDropdownComponent user={user} />
      </header>

      <AppDialogComponent
        open={dialogOpen}
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
