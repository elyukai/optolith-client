import { FC } from "react"
import { Button } from "../button/Button.tsx"
import { Icon } from "../icon/Icon.tsx"
import "./IconButton.scss"

interface Props {
  active?: boolean
  autoWidth?: boolean
  className?: string
  disabled?: boolean
  flat?: boolean
  fullWidth?: boolean
  icon: string
  label: string
  primary?: boolean
  onClick? (): void
}

export const IconButton: FC<Props> = props => {
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
      >
      <Icon label={label}>{icon}</Icon>
    </Button>
  )
}
