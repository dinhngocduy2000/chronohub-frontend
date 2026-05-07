import type { AxiosRequestConfig } from 'axios'
import axiosConfig from '.'

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosConfig(config)
}

export default customInstance
