import type { Ref } from 'react'
import AppLogo from '@/assets/svgs/app-logo'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getTranslations } from '@/lib/translation'
import { useCreateGroupForm } from './use-create-group-form'

const t = getTranslations()

export type CreateGroupFormHandle = {
  submit: () => void
}

type CreateGroupFormProps = {
  ref?: Ref<CreateGroupFormHandle>
  closeModal: () => void
  onFormStateChange?: (state: { isValid: boolean; isPending: boolean; isDirty: boolean }) => void
}

export default function CreateGroupForm({
  ref,
  closeModal,
  onFormStateChange,
}: CreateGroupFormProps) {
  const { form, onSubmit } = useCreateGroupForm({ ref, closeModal, onFormStateChange })

  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <AppLogo className="size-16" />
        <h2 className="text-xl font-semibold">{t.create_group_welcome_title()}</h2>
        <p className="text-sm text-muted-foreground">{t.create_group_welcome_description()}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter group name" maxLength={50} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter group description (optional)"
                    maxLength={250}
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
