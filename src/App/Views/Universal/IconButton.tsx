import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { Button } from "./Button";
import { Icon } from "./Icon";

interface Props {
  active?: boolean
  autoWidth?: boolean
  className?: string
  disabled?: boolean | Maybe<boolean>
  flat?: boolean
  fullWidth?: boolean
  hint?: Maybe<string>
  primary?: boolean
  round?: boolean
  onClick? (): void
  icon: string
}

export const IconButton: React.FC<Props> = props => {
  const {
    autoWidth,
    icon,
    className,
    disabled,
    flat,
    fullWidth,
    hint,
    primary,
    onClick,
  } = props

  return (
    <Button
      autoWidth={autoWidth}
      className={className}
      disabled={disabled}
      flat={flat}
      fullWidth={fullWidth}
      hint={hint}
      primary={primary}
      onClick={onClick}
      round
      >
      <Icon>{icon}</Icon>
    </Button>
  )
}
