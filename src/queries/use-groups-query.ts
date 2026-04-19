import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGroupApi, getListGroupKeyValue } from '@/api/groups'
import { GROUPS_ENDPOINTS } from '@/enum/endpoints'
import type { IResponseData } from '@/interface/api-response'
import type { ICreateGroupRequest, IGroupInfo } from '@/interface/groups'
import type { IMutation, ReactQueryHookParams } from '@/interface/utils'
import { GET_PROFILE_QUERY_KEY } from './use-auth-query'

const getListGroupKeyValueQueryKey = (params: unknown, queryKey: unknown[]) => {
  return [GROUPS_ENDPOINTS.LIST_KEY_VALUE, GROUPS_ENDPOINTS.LIST_GROUP, params, ...queryKey]
}

export const useCreateGroupMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<IResponseData<IGroupInfo>, ICreateGroupRequest> = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createGroupApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: GET_PROFILE_QUERY_KEY })
      onSuccess?.(data, variables)
    },
    onError,
    onMutate,
  })
}

export const useListGroupKeyValueQuery = ({
  params,
  queryKey = [],
  enabled = true,
}: ReactQueryHookParams<null>) => {
  return useQuery({
    queryKey: getListGroupKeyValueQueryKey(params, queryKey),
    queryFn: async ({ signal }) => await getListGroupKeyValue({ signal }),
    enabled,
  })
}
