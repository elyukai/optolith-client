import { forwardRef } from "react"
import { classList } from "../../utils/classList.ts"
import { FRRFC } from "../../utils/react.js"
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

const Button: FRRFC<HTMLButtonElement, Props> = (props, ref) => {
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
      onClick={disabled === true || onClick === undefined ? undefined : onClick}
      disabled={disabled === true || onClick === undefined}
      ref={ref}
      >
      {children}
    </button>
  )

  return btnElement
}

const ButtonWithRef = forwardRef(Button)

export { ButtonWithRef as Button }
