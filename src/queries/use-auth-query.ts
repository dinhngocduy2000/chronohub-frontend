import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  getGoogleLoginURLAPI,
  getProfileApi,
  loginApi,
  logoutAPI,
  registerApi,
  trackSession,
} from '@/api/auth'
import { AUTH_ENDPOINTS } from '@/enum/endpoints'
import { KEY_STORAGE } from '@/enum/key-storage'
import { ROUTES } from '@/enum/routes'
import type { IResponseData } from '@/interface/api-response'
import type { ILoginRequest, IRegisterRequest } from '@/interface/auth'
import type { IMutation } from '@/interface/utils'

export const GET_TRACK_SESSION_QUERY_KEY = [AUTH_ENDPOINTS.TRACK_SESSION]
export const GET_PROFILE_QUERY_KEY = [AUTH_ENDPOINTS.PROFILE]

export const useLoginMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<string, ILoginRequest>) => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (_, variables) => {
      localStorage.setItem(KEY_STORAGE.IS_LOGGED_IN, 'true')
      if (variables.is_save_session) {
        localStorage.setItem(KEY_STORAGE.IS_SAVE_SESSION, 'true')
      }
      onSuccess?.()
    },
    onError,
    onMutate,
  })
}

export const useRegisterMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<unknown, IRegisterRequest> = {}) => {
  return useMutation({
    mutationFn: registerApi,
    onSuccess,
    onError,
    onMutate,
  })
}

export const useTrackSessionQuery = () => {
  return useQuery({
    queryKey: GET_TRACK_SESSION_QUERY_KEY,
    queryFn: trackSession,
    refetchInterval: () => 1000 * 60 * 10, // 10 min; stop when failed
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    retry: (num) => {
      if (num > 2) {
        return false
      }
      return true
    },
  })
}

export const useProfileQuery = () => {
  return useQuery({
    queryKey: GET_PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => getProfileApi(signal),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: (num) => {
      if (num > 2) {
        return false
      }
      return true
    },
  })
}

export const useLogoutMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<unknown, void> = {}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: GET_PROFILE_QUERY_KEY })
      localStorage.removeItem(KEY_STORAGE.IS_LOGGED_IN)
      localStorage.removeItem(KEY_STORAGE.IS_SAVE_SESSION)
      navigate({ to: ROUTES.LOGIN as string })
      onSuccess?.()
    },
    onError,
    onMutate,
  })
}

export const useGetGoogleLoginURL = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<IResponseData<{ url: string }>, unknown>) => {
  return useMutation({
    mutationFn: getGoogleLoginURLAPI,
    onSuccess: (res) => {
      window.location.href = res.data.url
      onSuccess?.(res)
    },
    onError,
    onMutate,
  })
}
