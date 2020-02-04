import * as React from "react";
import { notNullStrUndef } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { Button } from "./Button";
import { Text } from "./Text";

interface Props {
  active?: boolean
  autoWidth?: boolean
  className?: string
  disabled?: boolean | Maybe<boolean>
  flat?: boolean
  fullWidth?: boolean
  hint?: Maybe<string>
  label: string | undefined
  primary?: boolean
  round?: boolean
  onClick? (): void
}

export const BorderButton: React.FC<Props> = props => {
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
