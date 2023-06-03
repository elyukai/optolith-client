import { classList } from "../../../../shared/helpers/classList.ts"
import { FCC } from "../../../../shared/helpers/react.js"
import { isNonEmptyString } from "../../../../shared/helpers/string.ts"

export interface TabBaseProps {
  className?: string
  disabled?: boolean
  label: string | undefined
}

export interface TabProps extends TabBaseProps {
  active: boolean
  onClick (): void
}

export const Tab: FCC<TabProps> = props => {
  const { active, children, className, disabled = false, label, onClick } = props

  return (
    <li
      className={classList(
        "tab",
        className,
        {
          "tab--active": active,
          "tab--disabled": disabled,
        }
      )}
      >
      <a
        aria-current={active}
        onClick={disabled ? undefined : onClick}
        >
        {isNonEmptyString(label) ? label : children}
      </a>
    </li>
  )
}
