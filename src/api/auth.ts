import { AUTH_ENDPOINTS } from '@/enum/endpoints'
import type { IResponseData } from '@/interface/api-response'
import type { ILoginRequest, ILoginResponse } from '@/interface/auth'
import { axiosConfigWithoutAuth } from '.'

export const loginApi = async (data: ILoginRequest): Promise<IResponseData<ILoginResponse>> => {
  return await axiosConfigWithoutAuth.post(AUTH_ENDPOINTS.LOGIN, data, {
    withCredentials: true,
  })
}
