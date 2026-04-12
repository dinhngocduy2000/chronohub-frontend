/** biome-ignore-all lint/a11y/useButtonType: testing only */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { AppSelectComponent } from '@/components/reusable/alert-dialog/app-select-component'
import type { IOption } from '@/interface/utils'

beforeAll(() => {
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof ResizeObserver

  Element.prototype.scrollIntoView = vi.fn()
})

vi.mock('@/components/ui/button', () => ({
  Button: ({
    asChild: _asChild,
    loading: _loading,
    children,
    ...props
  }: React.PropsWithChildren<
    { asChild?: boolean; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
  >) => <button {...props}>{children}</button>,
}))

const ITEMS: IOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('AppSelectComponent', () => {
  describe('radio mode (default)', () => {
    it('renders the trigger with the default placeholder', () => {
      render(<AppSelectComponent items={ITEMS} value="" onChange={vi.fn()} />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Select item...')
    })

    it('renders a custom placeholder', () => {
      render(
        <AppSelectComponent items={ITEMS} value="" onChange={vi.fn()} placeholder="Pick one" />,
      )
      expect(screen.getByRole('combobox')).toHaveTextContent('Pick one')
    })

    it('shows the selected item label when value matches', () => {
      render(<AppSelectComponent items={ITEMS} value="banana" onChange={vi.fn()} />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
    })

    it('opens the dropdown and renders all items on trigger click', async () => {
      render(<AppSelectComponent items={ITEMS} value="" onChange={vi.fn()} />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      for (const item of ITEMS) {
        expect(screen.getByText(item.label)).toBeInTheDocument()
      }
    })

    it('calls onChange with the selected item value', async () => {
      const onChange = vi.fn()
      render(<AppSelectComponent items={ITEMS} value="" onChange={onChange} />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: 'Banana' }))
      expect(onChange).toHaveBeenCalledWith('banana')
    })

    it('closes the dropdown after selecting an item', async () => {
      render(<AppSelectComponent items={ITEMS} value="" onChange={vi.fn()} />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByText('Apple')).toBeInTheDocument()
      await user.click(screen.getByRole('option', { name: 'Banana' }))
      expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
    })
  })

  describe('checkbox mode', () => {
    it('always shows the placeholder in the trigger', () => {
      render(
        <AppSelectComponent
          type="checkbox"
          items={ITEMS}
          value={['apple']}
          onChange={vi.fn()}
          placeholder="Select fruits"
        />,
      )
      expect(screen.getByRole('combobox')).toHaveTextContent('Select fruits')
    })

    it('calls onChange adding the selected item', async () => {
      const onChange = vi.fn()
      render(<AppSelectComponent type="checkbox" items={ITEMS} value={[]} onChange={onChange} />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: /Apple/ }))
      expect(onChange).toHaveBeenCalledWith(['apple'])
    })

    it('calls onChange removing an already-selected item', async () => {
      const onChange = vi.fn()
      render(
        <AppSelectComponent
          type="checkbox"
          items={ITEMS}
          value={['apple', 'banana']}
          onChange={onChange}
        />,
      )
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: /Apple/ }))
      expect(onChange).toHaveBeenCalledWith(['banana'])
    })

    it('keeps the dropdown open after selecting an item', async () => {
      render(<AppSelectComponent type="checkbox" items={ITEMS} value={[]} onChange={vi.fn()} />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: /Apple/ }))
      expect(screen.getByRole('option', { name: /Banana/ })).toBeInTheDocument()
    })

    describe('select all (enableSelectAll)', () => {
      it('renders the "All" option when enabled', async () => {
        render(
          <AppSelectComponent
            type="checkbox"
            items={ITEMS}
            value={[]}
            onChange={vi.fn()}
            enableSelectAll
          />,
        )
        const user = userEvent.setup()
        await user.click(screen.getByRole('combobox'))
        expect(screen.getByRole('option', { name: /All/ })).toBeInTheDocument()
      })

      it('does not render "All" when enableSelectAll is false', async () => {
        render(<AppSelectComponent type="checkbox" items={ITEMS} value={[]} onChange={vi.fn()} />)
        const user = userEvent.setup()
        await user.click(screen.getByRole('combobox'))
        expect(screen.queryByRole('option', { name: /^All$/ })).not.toBeInTheDocument()
      })

      it('selects all items when none are selected', async () => {
        const onChange = vi.fn()
        render(
          <AppSelectComponent
            type="checkbox"
            items={ITEMS}
            value={[]}
            onChange={onChange}
            enableSelectAll
          />,
        )
        const user = userEvent.setup()
        await user.click(screen.getByRole('combobox'))
        await user.click(screen.getByRole('option', { name: /All/ }))
        expect(onChange).toHaveBeenCalledWith(['apple', 'banana', 'cherry'])
      })

      it('deselects all items when all are already selected', async () => {
        const onChange = vi.fn()
        render(
          <AppSelectComponent
            type="checkbox"
            items={ITEMS}
            value={['apple', 'banana', 'cherry']}
            onChange={onChange}
            enableSelectAll
          />,
        )
        const user = userEvent.setup()
        await user.click(screen.getByRole('combobox'))
        await user.click(screen.getByRole('option', { name: /All/ }))
        expect(onChange).toHaveBeenCalledWith([])
      })

      it('does not render "All" option in radio mode', async () => {
        render(
          <AppSelectComponent
            type="radio"
            items={ITEMS}
            value=""
            onChange={vi.fn()}
            enableSelectAll
          />,
        )
        const user = userEvent.setup()
        await user.click(screen.getByRole('combobox'))
        expect(screen.queryByRole('option', { name: /^All$/ })).not.toBeInTheDocument()
      })
    })
  })

  describe('disabled and loading states', () => {
    it('disables the trigger when disabled is true', () => {
      render(<AppSelectComponent items={ITEMS} value="" onChange={vi.fn()} disabled />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('disables the trigger when loading is true', () => {
      render(<AppSelectComponent items={ITEMS} value="" onChange={vi.fn()} loading />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('does not open the dropdown when the trigger is disabled', async () => {
      render(<AppSelectComponent items={ITEMS} value="" onChange={vi.fn()} disabled />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })
  })

  describe('customTrigger', () => {
    it('renders the custom trigger instead of the default button', () => {
      render(
        <AppSelectComponent
          items={ITEMS}
          value=""
          onChange={vi.fn()}
          customTrigger={() => <button>Custom Trigger</button>}
        />,
      )
      expect(screen.getByRole('button', { name: 'Custom Trigger' })).toBeInTheDocument()
    })

    it('passes selected items to the custom trigger in checkbox mode', () => {
      render(
        <AppSelectComponent
          type="checkbox"
          items={ITEMS}
          value={['apple']}
          onChange={vi.fn()}
          customTrigger={(selected) => <button>{selected.length} selected</button>}
        />,
      )
      expect(screen.getByRole('button', { name: '1 selected' })).toBeInTheDocument()
    })
  })

  describe('renderItem', () => {
    it('uses the custom render function for each item', async () => {
      render(
        <AppSelectComponent
          items={ITEMS}
          value=""
          onChange={vi.fn()}
          renderItem={(item) => <span data-testid="custom-item">{item.label} (custom)</span>}
        />,
      )
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByText('Apple (custom)')).toBeInTheDocument()
      expect(screen.getByText('Banana (custom)')).toBeInTheDocument()
      expect(screen.getByText('Cherry (custom)')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows "No item found." when items list is empty', async () => {
      render(<AppSelectComponent items={[]} value="" onChange={vi.fn()} />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByText('No item found.')).toBeInTheDocument()
    })
  })
})
