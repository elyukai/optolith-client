import type { FC } from "react"
import { TextFieldLazy } from "../../../../../shared/components/textField/TextFieldLazy.tsx"

type Props = {
  label: string
  value: string | undefined
  action: (value: string) => void
  validator?: (value: string | undefined) => boolean
}

/**
 * Returns a textfield for use with personal data.
 */
export const PersonalDataTextField: FC<Props> = props => {
  const { label, value, action, validator } = props

  return (
    <div>
      <TextFieldLazy
        label={label}
        value={value}
        onChange={action}
        valid={validator ? validator(value) : true}
      />
    </div>
  )
}
