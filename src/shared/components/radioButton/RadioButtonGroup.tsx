import { Label } from "../label/Label.tsx"
import { RadioButton } from "./RadioButton.tsx"

/**
 * The possible type of a value of a radio option.
 */
export type RadioOptionValue = string | number

/**
 * Configuration for a radio option.
 */
export type RadioOption<A extends RadioOptionValue = RadioOptionValue> = {
  className?: string
  disabled?: boolean
  name: string
  value: A | undefined
}

interface Props<A extends RadioOptionValue = RadioOptionValue> {
  active: A | undefined
  array: RadioOption<A>[]
  disabled?: boolean
  label?: string
  onClick?(option: A | undefined): void
  onClickJust?(option: A): void
}

/**
 * A group of related radio controls.
 */
export const RadioButtonGroup = <A extends RadioOptionValue = RadioOptionValue>(
  props: Props<A>,
): React.ReactElement => {
  const { active, array: xs, disabled, label, onClick, onClickJust } = props

  const onClickCombined = (optionValue: A | undefined) => () => {
    if (typeof onClick === "function") {
      onClick(optionValue)
    }

    if (typeof onClickJust === "function" && optionValue !== undefined) {
      onClickJust(optionValue)
    }
  }

  return (
    <div className="radiobutton-group">
      {label === undefined ? null : <Label text={label} />}
      {xs.map(e => (
        <RadioButton
          key={e.value ?? "__default__"}
          value={e.value}
          active={e.value === active}
          onClick={onClickCombined(e.value)}
          disabled={e.disabled === true || disabled === true}
        >
          {e.name}
        </RadioButton>
      ))}
    </div>
  )
}
