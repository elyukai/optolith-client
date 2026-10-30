import type { FC } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { InputButtonGroup } from "../../../../../shared/components/inputButtonGroup/InputButtonGroup.tsx"
import { TextFieldLazy } from "../../../../../shared/components/textField/TextFieldLazy.tsx"

type Props = {
  label: string
  rerollLabel: string
  value: string | undefined
  action: (value: string) => void
  onReroll: () => void
  validator?: (value: string | undefined) => boolean
}

/**
 * Returns a textfield with a reroll option for use with personal data.
 */
export const PersonalDataTextFieldWithReroll: FC<Props> = props => {
  const { label, rerollLabel, value, action, onReroll, validator } = props

  return (
    <InputButtonGroup className="reroll">
      <TextFieldLazy
        label={label}
        value={value}
        onChange={action}
        valid={validator ? validator(value) : true}
      />
      <IconButton icon="&#xE913;" label={rerollLabel} onClick={onReroll} />
    </InputButtonGroup>
  )
}
