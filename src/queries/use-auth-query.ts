import { useMutation } from '@tanstack/react-query'
import { loginApi, registerApi } from '@/api/auth'

export const useLoginMutation = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess,
  })
}

export const useRegisterMutation = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  return useMutation({
    mutationFn: registerApi,
    onSuccess,
  })
}
