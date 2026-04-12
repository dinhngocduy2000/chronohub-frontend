import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGroupApi } from '@/api/groups'
import type { IResponseData } from '@/interface/api-response'
import type { ICreateGroupRequest, IGroupInfo } from '@/interface/groups'
import type { IMutation } from '@/interface/utils'
import { GET_PROFILE_QUERY_KEY } from './use-auth-query'

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
