import { FC, useCallback } from "react"
import { Button } from "../button/Button.tsx"

type Props = {
  active?: boolean
  autoWidth?: boolean
  className?: string
  disabled?: boolean
  flat?: boolean
  fullWidth?: boolean
  hint?: string
  label: string | undefined
  primary?: boolean
  onClick?(): void
  onClickDefault?(f?: () => void): void
}

/**
 * Configuration for a dialog button.
 */
export type DialogButtonProps = Omit<Props, "onClickDefault">

/**
 * A button for the bottom side of a dialog.
 */
export const DialogButton: FC<Props> = props => {
  const {
    active,
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

  const handleClick = useCallback(
    () =>
      typeof onClickDefault === "function"
        ? onClickDefault(onClick)
        : typeof onClick === "function"
        ? onClick()
        : undefined,
    [onClick, onClickDefault],
  )

  return (
    <Button
      active={active}
      autoWidth={autoWidth}
      className={className}
      disabled={disabled}
      flat={flat}
      fullWidth={fullWidth}
      hint={hint}
      primary={primary}
      onClick={handleClick}
      key={label}
    >
      {label}
    </Button>
  )
}
