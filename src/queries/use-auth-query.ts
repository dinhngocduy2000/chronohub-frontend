import { useMutation, useQuery } from '@tanstack/react-query'
import { loginApi, registerApi, trackSession } from '@/api/auth'
import { AUTH_ENDPOINTS } from '@/enum/endpoints'
import { KEY_STORAGE } from '@/enum/key-storage'
import type { ILoginRequest, ILoginResponse, IRegisterRequest } from '@/interface/auth'
import type { IMutation } from '@/interface/utils'

export const GET_TRACK_SESSION_QUERY_KEY = [AUTH_ENDPOINTS.TRACK_SESSION]

export const useLoginMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<ILoginResponse, ILoginRequest> = {}) => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      localStorage.setItem(KEY_STORAGE.IS_LOGGED_IN, 'true')
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
    refetchInterval: 1000 * 60 * 10, // 10 minutes
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  })
}
