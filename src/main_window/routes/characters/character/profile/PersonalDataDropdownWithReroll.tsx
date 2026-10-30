import type { FC } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import type { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { InputButtonGroup } from "../../../../../shared/components/inputButtonGroup/InputButtonGroup.tsx"

type Props = {
  label: string
  rerollLabel: string
  value: string | undefined
  options: DropdownOption<string>[]
  action: (value: string) => void
  onReroll: () => void
}

const getKey = (option: DropdownOption<string>) => option.id

/**
 * Returns a dropdown with a reroll option for use with personal data.
 */
export const PersonalDataDropdownWithReroll: FC<Props> = props => {
  const { label, rerollLabel, value, options, action, onReroll } = props

  return (
    <InputButtonGroup className="reroll">
      <Dropdown
        label={label}
        value={value}
        onChange={action}
        options={options}
        disabled={options.length === 1 && value === options[0]!.id}
        getKey={getKey}
      />
      <IconButton
        icon="&#xE913;"
        label={rerollLabel}
        onClick={onReroll}
        disabled={options.length === 1}
      />
    </InputButtonGroup>
  )
}
