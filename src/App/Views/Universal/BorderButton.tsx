import * as React from "react";
import { notNullStrUndef } from "../../../Data/List";
import { Button, ButtonProps } from "./Button";
import { Text } from "./Text";

export interface BorderButtonProps extends ButtonProps {
  label: string | undefined
}

export const BorderButton: React.FC<BorderButtonProps> = props => {
  const {
    autoWidth,
    children,
    className,
    disabled,
    flat,
    fullWidth,
    hint,
    primary,
    onClick,
    label,
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
      >
      <Text>{notNullStrUndef (label) ? label : children}</Text>
    </Button>
  )
}
