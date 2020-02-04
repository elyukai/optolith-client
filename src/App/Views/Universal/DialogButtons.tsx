import * as React from "react"
import { DialogButton, DialogButtonProps } from "./DialogButton"

interface Props {
  list: DialogButtonProps[]
  onClickDefault? (f?: () => void): void
}

export const DialogButtons: React.FC<Props> = props => {
  const { list, onClickDefault } = props

  const buttons =
    Array.isArray (list) && list.length > 0
      ? list.map (
          ({
            active,
            autoWidth,
            className,
            disabled,
            flat,
            fullWidth,
            hint,
            label,
            primary,
            onClick,
          }) => (
            <DialogButton
              key={label}
              active={active}
              autoWidth={autoWidth}
              className={className}
              disabled={disabled}
              flat={flat}
              fullWidth={fullWidth}
              hint={hint}
              label={label}
              primary={primary}
              onClick={onClick}
              onClickDefault={onClickDefault}
              />
          )
        )
      : []

  return (
    <div className="dialog-buttons">
      <div className="dialog-buttons-inner">
        {buttons}
      </div>
    </div>
  )
}
