import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { KEY_STORAGE } from '@/enum/key-storage'
import { ROUTES } from '@/enum/routes'
import { getAuth } from '@/generated/api/auth/auth'
import type {
  BaseResponseStr,
  GetSsoAuthUrlApiV1AuthSsoGetParams,
  SSOLoginResponse,
  UserCreate,
  UserLogin,
  ValidateOTPRequest,
} from '@/generated/types'
import type { IMutation } from '@/interface/utils'
import { GET_PROFILE_QUERY_KEY, GET_TRACK_SESSION_QUERY_KEY } from './auth-query-keys'

export { GET_PROFILE_QUERY_KEY, GET_TRACK_SESSION_QUERY_KEY } from './auth-query-keys'

export const useLoginMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<string, UserLogin>) => {
  return useMutation({
    mutationFn: (data: UserLogin) => getAuth().authenticateUserApiV1AuthLoginPost(data),
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
}: IMutation<unknown, UserCreate> = {}) => {
  return useMutation({
    mutationFn: (data: UserCreate) => getAuth().registerUserApiV1AuthRegisterPost(data),
    onSuccess,
    onError,
    onMutate,
  })
}

export const useTrackSessionQuery = () => {
  return useQuery({
    queryKey: GET_TRACK_SESSION_QUERY_KEY,
    queryFn: ({ signal }) => getAuth().trackSessionApiV1AuthTrackGet(signal),
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
    queryFn: async ({ signal }) => {
      const res = await getAuth().getCurrentUserProfileApiV1AuthProfileGet(signal)
      return res
    },
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
    mutationFn: getAuth().logoutApiV1AuthLogoutPost,
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
}: IMutation<SSOLoginResponse, GetSsoAuthUrlApiV1AuthSsoGetParams>) => {
  return useMutation({
    mutationFn: (payload: GetSsoAuthUrlApiV1AuthSsoGetParams) =>
      getAuth().getSsoAuthUrlApiV1AuthSsoGet(payload),
    onSuccess: (res) => {
      window.location.href = res.data.url
      onSuccess?.(res)
    },
    onError,
    onMutate,
  })
}

export const useValidateOTPMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation<BaseResponseStr, ValidateOTPRequest>) => {
  return useMutation({
    mutationFn: (payload: ValidateOTPRequest) =>
      getAuth().validateOtpApiV1AuthValidateOtpPost(payload as ValidateOTPRequest),
    onSuccess,
    onError,
    onMutate,
  })
}
