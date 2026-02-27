import { z } from 'zod'

const toTrimmedString = (value: string) => {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  return String(value).trim()
}
export const emailSchemas = z.object({
  email: z.preprocess(
    toTrimmedString,
    z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email format' }),
  ),
})

export const passwordSchemas = z.object({
  password: z.preprocess(toTrimmedString, z.string().min(1, { message: 'Password is required' })),
})

export const otpSchemas = z.object({
  otp: z.preprocess(
    toTrimmedString,
    z.string().min(1, { message: 'OTP is required' }).min(6, { message: 'OTP is incorrect' }),
  ),
})
