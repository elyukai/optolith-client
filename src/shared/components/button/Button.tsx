import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.js"
import "./Button.scss"

interface Props {
  active?: boolean
  autoWidth?: boolean
  className?: string
  disabled?: boolean
  flat?: boolean
  fullWidth?: boolean
  hint?: string
  primary?: boolean
  round?: boolean
  onClick? (): void
}

export const Button: FCC<Props> = props => {
  const {
    active,
    autoWidth,
    className,
    primary,
    flat,
    fullWidth,
    disabled,
    round,
    children,
    onClick,
  } = props

  const btnElement = (
    <button
      className={classList(
        "btn",
        round === true ? "btn--round" : "btn--text",
        className,
        {
          "btn--primary": primary === true,
          "btn--flat": flat === true,
          "btn--auto-width": autoWidth,
          "btn--full-width": fullWidth,
          "btn--active": active,
        }
      )}
      onClick={disabled === true ? undefined : onClick}
      disabled={disabled === true}
      >
      {children}
    </button>
  )

  return btnElement
}
