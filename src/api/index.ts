import axios, { type AxiosResponse, HttpStatusCode } from 'axios'
import { ENV_CONFIGS } from '@/lib/env-const'

const axiosConfig = axios.create({
  baseURL: `${ENV_CONFIGS.VITE_API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
})
// Add a request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    // const accessToken = localStorage.getItem(KEY_STORAGE.ACCESS_TOKEN)
    // if (accessToken) {
    //   config.headers['Authorization'] = `Bearer ${accessToken}`
    //   config.headers['Accept-Language'] = getCurrentLanguage()
    // }

    // // Do something before request is sent
    return config
  },
  (error) =>
    // Do something with request error
    Promise.reject(error),
)
// Add a response interceptor
axiosConfig.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }
    switch (error.response.status) {
      case HttpStatusCode.Forbidden:
        // handleLogout()
        break
      case HttpStatusCode.NotFound:
        break
      case HttpStatusCode.Unauthorized:
        return

      case HttpStatusCode.InternalServerError:
        break
      default:
        break
    }

    return Promise.reject(error)
  },
)

export const axiosConfigWithoutAuth = axios.create({
  baseURL: ENV_CONFIGS.VITE_API_ENDPOINT as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a response interceptor
axiosConfigWithoutAuth.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

// const renewToken = async () => {
//   // TODO: refresh token function here
//   try {
//     const refreshToken = localStorage.getItem(KEY_STORAGE.REFRESH_TOKEN)
//     if (!refreshToken) {
//       handleLogout()
//       return
//     }
//     const response = await refreshTokenAPI({ refreshToken })
//     localStorage.setItem(KEY_STORAGE.ACCESS_TOKEN, response.data.accessToken)
//     localStorage.setItem(KEY_STORAGE.REFRESH_TOKEN, response.data.refreshToken)
//     return response.data.accessToken
//   } catch {
//     handleLogout()
//   }
// }

// const handleRenewToken = async (error: unknown) => {
//   if (!(error instanceof AxiosError)) {
//     return
//   }
//   const originalRequest = error.config
//   if (!originalRequest) {
//     return
//   }
//   const newAccessToken = await renewToken()
//   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
//   return await axiosConfig(originalRequest)
// }

export default axiosConfig
