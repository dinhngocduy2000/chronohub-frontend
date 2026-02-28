import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type Resolver, useForm } from 'react-hook-form'

import { loginApi } from '@/api/auth'
import { GoogleIcon } from '@/assets/google-icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TypographyMuted, TypographyP } from '@/components/ui/typography'
import type { IResponseData } from '@/interface/api-response'
import type { ILoginFormType } from '@/interface/auth'
import { loginFormSchemas } from '@/schemas/auth-schemas'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<ILoginFormType>({
    resolver: zodResolver(loginFormSchemas as never) as Resolver<ILoginFormType>,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      navigate({ to: '/' })
    },
  })

  const onSubmit = (data: ILoginFormType) => {
    mutateAsync({ email: data.email, password: data.password, rememberMe: data.rememberMe })
  }

  const serverError = error as AxiosError<IResponseData<null>> | null

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              {serverError && (
                <TypographyP className="mt-0! text-sm text-destructive">
                  {serverError.response?.data?.message || 'Login failed. Please try again.'}
                </TypographyP>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Sign in
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <TypographyMuted className="bg-card px-2">Or continue with</TypographyMuted>
            </div>
          </div>

          <Button variant="outline" className="w-full" type="button" disabled>
            <GoogleIcon className="size-4" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
