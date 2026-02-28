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
