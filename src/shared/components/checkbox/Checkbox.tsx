import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import { Activate } from "../activate/Activate.tsx"
import { Icon } from "../icon/Icon.tsx"
import "./Checkbox.scss"

type Props = {
  checked: boolean
  className?: string
  disabled?: boolean
  label?: string
  onClick(): void
}

/**
 * A custom checkbox with an optional label.
 */
export const Checkbox: FCC<Props> = props => {
  const { checked, children, className, disabled, label, onClick } = props

  return (
    <Activate
      active={checked === true}
      className={classList("checkbox", className)}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon label="">
        <div className="border" />
        <div className="hook" />
      </Icon>
      <div className="checkbox-label">{label === undefined ? children : label}</div>
    </Activate>
  )
}
