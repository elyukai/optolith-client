import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import type { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"

type Props<ID> = {
  label: string
  value: ID | undefined
  options: DropdownOption<ID>[]
  action: (value: ID) => void
}

const getKey = <ID extends string | number | undefined>(option: DropdownOption<ID>) => option.id

/**
 * Returns a dropdown for use with personal data.
 */
export const PersonalDataDropdown = <ID extends string | number | undefined>(props: Props<ID>) => {
  const { label, value, options, action } = props

  return (
    <div>
      <Dropdown
        label={label}
        value={value}
        onChange={action}
        options={options}
        disabled={options.length === 1 && value === options[0]!.id}
        getKey={getKey}
      />
    </div>
  )
}
