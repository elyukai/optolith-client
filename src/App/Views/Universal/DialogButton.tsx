import * as React from "react";
import { BorderButton, BorderButtonProps } from "./BorderButton";

export interface DialogButtonProps {
  buttonProps: BorderButtonProps
  onClickDefault? (f?: () => void): void
}

export const DialogButton: React.FC<DialogButtonProps> = ({ buttonProps, onClickDefault }) => {
  const handleClick = React.useCallback (
    () => typeof onClickDefault === "function"
          ? onClickDefault (buttonProps.onClick)
          : typeof buttonProps.onClick === "function"
          ? buttonProps.onClick ()
          : undefined,
    [buttonProps, onClickDefault]
  )

  return (
    <BorderButton
      active={buttonProps.active}
      autoWidth={buttonProps.autoWidth}
      className={buttonProps.className}
      disabled={buttonProps.disabled}
      flat={buttonProps.flat}
      fullWidth={buttonProps.fullWidth}
      hint={buttonProps.hint}
      primary={buttonProps.primary}
      round={buttonProps.round}
      label={buttonProps.label}
      onClick={handleClick}
      key={buttonProps.label}
      />
  )
}
