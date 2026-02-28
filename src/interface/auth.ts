import type z from 'zod'
import type {
  emailSchemas,
  loginFormSchemas,
  otpSchemas,
  passwordSchemas,
} from '@/schemas/auth-schemas'

export type IEmailFormType = z.infer<typeof emailSchemas>
export type IPasswordFormType = z.infer<typeof passwordSchemas>
export type IOTPFormType = z.infer<typeof otpSchemas>
export type ILoginFormType = z.infer<typeof loginFormSchemas>

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
