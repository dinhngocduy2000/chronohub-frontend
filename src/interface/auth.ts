import type z from 'zod'
import type {
  createEmailSchemas,
  createLoginFormSchemas,
  createOtpSchemas,
  createPasswordSchemas,
  createRegisterFormSchemas,
} from '@/schemas/auth-schemas'

export type IEmailFormType = z.infer<ReturnType<typeof createEmailSchemas>>
export type IPasswordFormType = z.infer<ReturnType<typeof createPasswordSchemas>>
export type IOTPFormType = z.infer<ReturnType<typeof createOtpSchemas>>
export type ILoginFormType = z.infer<ReturnType<typeof createLoginFormSchemas>>
export type IRegisterFormType = z.infer<ReturnType<typeof createRegisterFormSchemas>>

export type ILoginRequest = {
  email: string
  rememberMe?: boolean
} & Partial<IPasswordFormType> &
  Partial<IOTPFormType>

export type ILoginResponse = {
  accessToken: string
  refreshToken: string
  user: IUserProfile
}

export type IVerifyOTPRequest = IEmailFormType & IOTPFormType

export type IVerifyGoogleCodeRequest = {
  code: string
  redirectUri: string
}

export type IRegisterRequest = { fullName?: string } & IEmailFormType &
  IPasswordFormType &
  IOTPFormType

export type IUserProfile = {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  email: string
  fullName: string
  active: boolean
  avatar: string
  activeOrganizationId: string
}

export type IRefreshTokenRequest = {
  refreshToken: string
}

export type IRefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}
