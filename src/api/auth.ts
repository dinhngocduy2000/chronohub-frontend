import { AUTH_ENDPOINTS } from '@/enum/endpoints'
import type { IResponseData } from '@/interface/api-response'
import type { ILoginRequest, ILoginResponse, IRegisterFormType } from '@/interface/auth'
import { axiosConfigWithoutAuth } from '.'

export const loginApi = async (data: ILoginRequest): Promise<IResponseData<ILoginResponse>> => {
  return await axiosConfigWithoutAuth.post(AUTH_ENDPOINTS.LOGIN, data, {
    withCredentials: true,
  })
}

export const registerApi = async (
  data: Omit<IRegisterFormType, 'confirmPassword'>,
): Promise<IResponseData<null>> => {
  return await axiosConfigWithoutAuth.post(AUTH_ENDPOINTS.REGISTER, data)
}
