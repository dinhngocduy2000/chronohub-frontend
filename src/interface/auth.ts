import type z from 'zod'
import type { UserStatusType } from '@/enum/users'
import type {
  createEmailSchemas,
  createLoginFormSchemas,
  createOtpSchemas,
  createPasswordSchemas,
  createRegisterFormSchemas,
} from '@/schemas/auth-schemas'
import type { IGroupInfo } from './groups'

export type IEmailFormType = z.infer<ReturnType<typeof createEmailSchemas>>
export type IPasswordFormType = z.infer<ReturnType<typeof createPasswordSchemas>>
export type IOTPFormType = z.infer<ReturnType<typeof createOtpSchemas>>
export type ILoginFormType = z.infer<ReturnType<typeof createLoginFormSchemas>>
export type IRegisterFormType = z.infer<ReturnType<typeof createRegisterFormSchemas>>

export type ILoginRequest = {
  email: string
  is_save_session?: boolean
} & Partial<IPasswordFormType> &
  Partial<IOTPFormType>

export type IRegisterRequest = Omit<IRegisterFormType, 'confirmPassword'>

export type IVerifyOTPRequest = IEmailFormType & IOTPFormType

export type IVerifyGoogleCodeRequest = {
  code: string
  redirectUri: string
}

/** Profile payload from `GET /auth/profile` (snake_case, distinct from login `IUserProfile`). */
export type IUserProfileDetail = {
  id: string
  name: string
  email: string
  status: UserStatusType
  created_at: string
  updated_at: string
  image_url: string
  group_id?: string | null
  owned_groups: IGroupInfo[]
}

export type IRefreshTokenRequest = {
  refreshToken: string
}

export type IRefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}
