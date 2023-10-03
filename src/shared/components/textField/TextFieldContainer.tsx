import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import { TextFieldCounter } from "./TextFieldCounter.tsx"
import { TextFieldError } from "./TextFieldError.tsx"
import { TextFieldHint } from "./TextFieldHint.tsx"
import { TextFieldLabel } from "./TextFieldLabel.tsx"

type Props = {
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  error?: string
  fullWidth?: boolean
  hint?: string
  isFieldEmpty: boolean
  label?: string
  valid?: boolean
}

/**
 * The container for a text field.
 */
export const TextFieldContainer: FCC<Props> = props => {
  const {
    children,
    className,
    countCurrent,
    countMax,
    disabled,
    error,
    fullWidth,
    hint,
    isFieldEmpty,
    label,
    valid,
  } = props

  return (
    <div
      className={classList("textfield", className, {
        fullWidth,
        disabled,
        invalid: valid === false || error !== undefined,
      })}
    >
      <TextFieldLabel label={label} />
      {children}
      <TextFieldHint hint={hint} isFieldEmpty={isFieldEmpty} />
      <TextFieldCounter current={countCurrent} max={countMax} />
      <TextFieldError error={error} />
    </div>
  )
}
