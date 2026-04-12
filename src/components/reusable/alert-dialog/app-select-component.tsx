import { ChevronDown } from 'lucide-react'
import { Activity, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import type { IOption } from '@/interface/utils'
import { cn } from '@/lib/utils'

type BaseProps = {
  items: IOption[]
  placeholder?: string | React.ReactNode
  loading?: boolean
  onSearch?: (value: string) => void
  triggerClassName?: string
  renderItem?: (item: IOption) => React.ReactNode
  customTrigger?: (selectedItems: IOption[]) => React.ReactNode
  enableSelectAll?: boolean
  disabled?: boolean
  dropdownContentClassName?: string
}

type CheckboxProps = BaseProps & {
  type: 'checkbox'
  value: string[]
  onChange: (value: string[]) => void
}

type RadioProps = BaseProps & {
  type?: 'radio'
  value: string
  onChange: (value: string) => void
}

type Props = CheckboxProps | RadioProps

export function AppSelectComponent(props: Props) {
  const {
    items = [],
    placeholder = 'Select item...',
    onChange,
    value,
    type = 'radio',
    onSearch,
    triggerClassName,
    renderItem,
    customTrigger,
    enableSelectAll = false,
    disabled = false,
    loading = false,
    dropdownContentClassName,
  } = props
  const [open, setOpen] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<IOption[]>([])

  const onSelectItem = (chosenValue: string) => {
    if (type === 'checkbox') {
      onCheckboxItemSelect(chosenValue)
    } else {
      onRadioItemSelect(chosenValue)
      setOpen(false)
    }
  }

  const onCheckboxItemSelect = (chosenValue: string) => {
    if (type !== 'checkbox') return
    const checkboxValues = value as string[]
    if (checkboxValues.some((selectedValue) => selectedValue === chosenValue)) {
      ;(onChange as (value: string[]) => void)(
        checkboxValues.filter((selectedValue) => selectedValue !== chosenValue),
      )
      return
    }
    ;(onChange as (value: string[]) => void)([...checkboxValues, chosenValue])
  }

  const _onSelectAll = () => {
    if (type !== 'checkbox') {
      return
    }

    const checkboxValues = value as string[]
    if (checkboxValues.length === items.length) {
      ;(onChange as (value: string[]) => void)([])
      return
    }
    ;(onChange as (value: string[]) => void)(items.map((item) => item.value))
  }

  const onRadioItemSelect = (chosenValue: string) => {
    if (type === 'checkbox') return
    ;(onChange as (value: string) => void)(chosenValue)
  }

  useEffect(() => {
    if (type === 'checkbox') {
      const newValues = (value as string[]).map((item) => ({
        value: item,
        label: items.find((optionItem) => optionItem.value === item)?.label ?? '',
      }))
      setSelectedItems(newValues)
    }
  }, [value, type, items])

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger disabled={disabled || loading} asChild>
        {customTrigger ? (
          customTrigger(selectedItems)
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'flex h-9 w-[200px] items-center justify-between gap-2 truncate',
              triggerClassName,
            )}
          >
            {!!value && type === 'radio' ? (
              <span className="truncate">{items.find((item) => item.value === value)?.label}</span>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
            {loading ? <Spinner /> : <ChevronDown className="min-h-4 min-w-4 opacity-50" />}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[200px] p-0',
          onSearch && 'pt-3',
          dropdownContentClassName && dropdownContentClassName,
        )}
      >
        <Command>
          <CommandList className="min-h-fit">
            <Activity mode={onSearch ? 'visible' : 'hidden'}>
              <Input
                placeholder="Search an option.."
                className="m-3 w-115"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </Activity>

            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-[250px] overflow-auto">
              {enableSelectAll && type === 'checkbox' && (
                <CommandItem
                  className="flex w-full justify-between gap-2 capitalize"
                  key={'all'}
                  value={'all'}
                  onSelect={_onSelectAll}
                >
                  {
                    <>
                      All
                      <Checkbox
                        checked={(value as string[]).length === items.length}
                        className={cn('ml-auto size-4')}
                      />
                    </>
                  }
                </CommandItem>
              )}
              {items.map((item) => (
                <CommandItem
                  className="flex w-full justify-between gap-2 capitalize"
                  key={item.value}
                  value={item.value}
                  onSelect={onSelectItem}
                >
                  {renderItem?.(item) ?? (
                    <>
                      {item.label}
                      {type === 'checkbox' ? (
                        <Checkbox
                          checked={(value as string[]).some(
                            (selectedValue) => selectedValue === item.value,
                          )}
                          className={cn('ml-auto size-4')}
                        />
                      ) : (
                        <RadioGroup>
                          <RadioGroupItem
                            value={item.value}
                            checked={(value as string) === item.value}
                          />
                        </RadioGroup>
                      )}
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
