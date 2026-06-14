import type { AxiosRequestConfig } from 'axios'
import axiosConfig from '.'

export const customInstance = <T>(config: AxiosRequestConfig, signal?: AbortSignal): Promise<T> => {
  return axiosConfig({ ...config, signal: signal })
}

export default customInstance
