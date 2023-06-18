import { FCC } from "../../utils/react.ts"
import { Activate } from "../activate/Activate.tsx"
import { Icon } from "../icon/Icon.tsx"
import "./RadioButton.scss"

type Props = {
  active: boolean
  disabled?: boolean
  label?: string
  value?: string | number
  onClick(value: string | number | undefined): void
}

export const RadioButton: FCC<Props> = props => {
  const { active, children, disabled, label, onClick, value } = props

  return (
    <Activate
      className="radio"
      active={active}
      onClick={onClick}
      disabled={disabled}
      value={value}
      >
      <Icon label="">
        <div className="border" />
        <div className="dot" />
      </Icon>
      <div className="radio-label">
        {label === undefined ? children : label}
      </div>
    </Activate>
  )
}
