import * as React from "react";
import { Button, ButtonProps } from "./Button";
import { Icon } from "./Icon";

export interface IconButtonProps extends ButtonProps {
  icon: string
}

export const IconButton = (props: IconButtonProps) => {
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
