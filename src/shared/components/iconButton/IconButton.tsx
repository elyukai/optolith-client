import { forwardRef } from "react"
import { FRRFC } from "../../utils/react.ts"
import { Button } from "../button/Button.tsx"
import { Icon } from "../icon/Icon.tsx"
import "./IconButton.scss"

type Props = {
  active?: boolean
  autoWidth?: boolean
  className?: string
  disabled?: boolean
  flat?: boolean
  fullWidth?: boolean
  icon: string
  label: string
  primary?: boolean
  onClick?(): void
}

const IconButton: FRRFC<HTMLButtonElement, Props> = (props, ref) => {
  const {
    active,
    autoWidth,
    className,
    disabled,
    flat,
    fullWidth,
    icon,
    label,
    onClick,
    primary,
  } = props

  return (
    <Button
      active={active}
      autoWidth={autoWidth}
      className={className}
      disabled={disabled}
      flat={flat}
      fullWidth={fullWidth}
      primary={primary}
      onClick={onClick}
      round
      ref={ref}
      >
      <Icon label={label}>{icon}</Icon>
    </Button>
  )
}

const IconButtonWithRef = forwardRef(IconButton)

export { IconButtonWithRef as IconButton }
