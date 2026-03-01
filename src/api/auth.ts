import { AUTH_ENDPOINTS } from '@/enum/endpoints'
import type { IResponseData } from '@/interface/api-response'
import type { ILoginRequest, ILoginResponse, IRegisterRequest } from '@/interface/auth'
import axiosConfig, { axiosConfigWithoutAuth } from '.'

export const loginApi = async (data: ILoginRequest): Promise<IResponseData<ILoginResponse>> => {
  return await axiosConfigWithoutAuth.post(AUTH_ENDPOINTS.LOGIN, data)
}

export const registerApi = async (data: IRegisterRequest): Promise<IResponseData<null>> => {
  return await axiosConfigWithoutAuth.post(AUTH_ENDPOINTS.REGISTER, data)
}

export const trackSession = async (): Promise<IResponseData<null>> => {
  return await axiosConfig.get(AUTH_ENDPOINTS.TRACK_SESSION)
}

export const refreshTokenAPI = async (data: {
  is_save_session: boolean
}): Promise<IResponseData<unknown>> => {
  return await axiosConfigWithoutAuth.post(AUTH_ENDPOINTS.REFRESH_TOKEN, data)
}

export const logoutAPI = async (): Promise<IResponseData<null>> => {
  return await axiosConfig.post(AUTH_ENDPOINTS.LOGOUT)
}

export const getGoogleLoginURLAPI = async (): Promise<IResponseData<{ url: string }>> => {
  return await axiosConfigWithoutAuth.post(AUTH_ENDPOINTS.GOOGLE_LOGIN_URL)
}
