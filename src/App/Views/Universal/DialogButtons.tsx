import * as React from "react";
import { BorderButtonProps } from "./BorderButton";
import { DialogButton } from "./DialogButton";

export { BorderButtonProps as ButtonProps };

export interface DialogButtonsProps {
  list: BorderButtonProps[]
  onClickDefault? (f?: () => void): void
}

export function DialogButtons (props: DialogButtonsProps) {
  const { list, onClickDefault } = props

  const buttons =
    Array.isArray (list) && list.length > 0
      ? list.map (e => (
                   <DialogButton
                     key={e.label}
                     buttonProps={e}
                     onClickDefault={onClickDefault}
                     />
                 ))
      : []

  return (
    <div className="dialog-buttons">
      <div className="dialog-buttons-inner">
        {buttons}
      </div>
    </div>
  )
}
