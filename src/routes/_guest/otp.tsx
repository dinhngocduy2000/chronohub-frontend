import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useLocation, useNavigate, useRouterState } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { Activity, useEffect, useRef } from 'react'
import { type Resolver, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Form, FormField } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Spinner } from '@/components/ui/spinner'
import type { IOTPFormType } from '@/interface/auth'
import { getTranslations } from '@/lib/translation'
import { useRegisterMutation } from '@/queries/use-auth-query'
import { otpSchemas } from '@/schemas/auth-schemas'
export const Route = createFileRoute('/_guest/otp')({ component: OTPSignup })
// Define the state type — add this to the route file
declare module '@tanstack/react-router' {
  interface HistoryState {
    email?: string
  }
}
function OTPSignup() {
  const translations = getTranslations()
  const navigate = useNavigate()
  const email = useRouterState({ select: (state) => state.location.state.email })
  const form = useForm<IOTPFormType>({
    mode: 'onChange',
    resolver: zodResolver(otpSchemas() as never) as Resolver<IOTPFormType>,
  })
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = form
  const otpSlotsNumber = useRef<number>(6)
  //   const {
  //     data: _data,
  //     isFetching: isRequestOTPPending,
  //     refetch: refetchRequestOTP,
  //     error,
  //   } = useRequestOTPQuery({
  //     params: {
  //       email: item?.email ?? '',
  //     },
  //   })
  //   const location = useLocation()

  //   useEffect(() => {
  //     const axiosError = error as AxiosError<{ message?: string }> | undefined
  //     const errorMessage = axiosError?.response?.data?.message
  //     if (errorMessage) {
  //       setError('otp', { message: errorMessage })
  //     }
  //   }, [error, setError])

  return (
    <Form {...form}>
      <form
        //  onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <p className="text-center font-medium text-sm">
          {translations.sent_code_text()} <span className="block underline">{email}</span>
        </p>
        <FormField
          name="otp"
          control={control}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              //   disabled={isRegisterPending || isRequestOTPPending}
              className="flex flex-col"
              onComplete={
                () => true
                // onSubmit({
                //   otp: watch('otp'),
                // })
              }
              {...field}
              onChange={field.onChange}
            >
              <InputOTPGroup className="mx-auto gap-2 [&>div]:size-8 [&>div]:rounded-xl [&>div]:border-l sm:[&>div]:size-14">
                {Array.from({ length: otpSlotsNumber.current }).map((_, index) => (
                  <InputOTPSlot
                    key={`otp-slot-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: otp is always fixed slot
                      index
                    }`}
                    index={index}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        <Activity mode={errors ? 'visible' : 'hidden'}>
          <div className="flex w-full justify-center">
            <ErrorMessage
              errors={errors}
              name="otp"
              render={({ message }) => {
                return <p className="w-full text-center text-red-400 text-xs">{message}</p>
              }}
            />
          </div>
        </Activity>
        <FieldDescription className="text-center font-light text-[#000000DE]">
          {translations.didnt_get_code_text()}{' '}
          <Button variant="link" className="text-primary hover:cursor-pointer p-0">
            {translations.click_to_resend()}
          </Button>
        </FieldDescription>
        <Field>
          <Button
            // disabled={isRegisterPending || isRequestOTPPending}
            // loading={isRegisterPending}
            type="submit"
            className="h-12 gap-2 rounded-b-sm font-normal"
          >
            {translations.otp_button()}
          </Button>
        </Field>
      </form>
    </Form>
  )
}

export default OTPSignup
