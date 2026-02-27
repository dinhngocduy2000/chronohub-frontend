import { USERS_ENDPOINTS } from '@/enum/endpoints'
import type { IResponseData } from '@/interface/api-response'
import type { IRegisterRequest } from '@/interface/auth'
import { axiosConfigWithoutAuth } from '.'

export const checkEmailExists = async (
  data: Partial<IRegisterRequest>,
  signal?: AbortSignal,
): Promise<IResponseData<boolean>> => {
  return await axiosConfigWithoutAuth.get(USERS_ENDPOINTS.CHECK_EMAIL_EXISTS, {
    params: data,
    signal,
  })
}
