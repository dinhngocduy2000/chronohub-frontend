import type { ReactNode } from 'react'

export type ReactQueryHookParams<T> = {
  queryKey?: unknown[]
  params: T
}

export type IMutation<ResponseType = unknown, VariableType = unknown> = {
  onSuccess?: (data?: ResponseType, variables?: VariableType) => void
  onError?: (_error: unknown) => void
  onMutate?: VoidFunction
  signal?: AbortSignal
}

export type IOption = {
  label: string
  value: string
  subLabel?: string
  icon?: React.ReactNode
}

export type IDropdownMenuProps = {
  trigger?: string | ReactNode
  items: IDropdownMenuItem[]
  onSearch?: (value: string) => void
  dropdownContentClassName?: string
  contentAlign?: 'start' | 'end'
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}
export type IDropdownMenuItem = {
  label: string | ReactNode
  onClick: VoidFunction
  disabled?: boolean
}
