import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.js"
import { isNonEmptyString } from "../../utils/string.ts"

export interface TabBaseProps {
  className?: string
  disabled?: boolean
  label: string | undefined
}

export interface TabProps extends TabBaseProps {
  active: boolean
  onClick(): void
}

/**
 * A tab that can be selected.
 */
export const Tab: FCC<TabProps> = props => {
  const { active, children, className, disabled = false, label, onClick } = props

  return (
    <li
      className={classList("tab", className, {
        "tab--active": active,
        "tab--disabled": disabled,
      })}
    >
      <a aria-current={active} onClick={disabled ? undefined : onClick}>
        {isNonEmptyString(label) ? label : children}
      </a>
    </li>
  )
}
