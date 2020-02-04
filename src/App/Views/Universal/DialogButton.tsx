import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { BorderButton } from "./BorderButton";

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
  onClick? (): void
  onClickDefault? (f?: () => void): void
}

export type DialogButtonProps = Omit<Props, "onClickDefault">

export const DialogButton: React.FC<Props> = props => {
  const {
    autoWidth,
    className,
    disabled,
    flat,
    fullWidth,
    hint,
    primary,
    onClick,
    onClickDefault,
    label,
  } = props

  const handleClick = React.useCallback (
    () => typeof onClickDefault === "function"
          ? onClickDefault (onClick)
          : typeof onClick === "function"
          ? onClick ()
          : undefined,
    [ onClick, onClickDefault ]
  )

  return (
    <BorderButton
      autoWidth={autoWidth}
      className={className}
      disabled={disabled}
      flat={flat}
      fullWidth={fullWidth}
      hint={hint}
      primary={primary}
      label={label}
      onClick={handleClick}
      key={label}
      />
  )
}
