import { useQuery } from '@tanstack/react-query'
import { checkEmailExists } from '@/api/users'
import { USERS_ENDPOINTS } from '@/enum/endpoints'
import type { IEmailFormType } from '@/interface/auth'
import type { ReactQueryHookParams } from '@/interface/utils'

export const useCheckEmailExistenceQuery = ({
  queryKey = [],
  enabled = true,
  ...params
}: ReactQueryHookParams<IEmailFormType> & { enabled?: boolean }) => {
  return useQuery({
    queryKey: [USERS_ENDPOINTS.CHECK_EMAIL_EXISTS, params.params?.email, ...queryKey],
    queryFn: async ({ signal }) => await checkEmailExists(params?.params, signal),
    enabled: enabled,
  })
}
