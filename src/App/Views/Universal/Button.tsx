import * as classNames from "classnames";
import * as React from "react";
import { isMaybe, Maybe } from "../../../Data/Maybe";

export interface ButtonProps {
  active?: boolean
  autoWidth?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean | Maybe<boolean>
  flat?: boolean
  fullWidth?: boolean
  primary?: boolean
  round?: boolean
  onClick? (): void
  [id: string]: any
}

export const Button = (props: ButtonProps) => {
  const {
    active,
    autoWidth,
    primary,
    flat,
    fullWidth,
    disabled,
    round,
    children,
    onClick,
    ...other
  } = props

  let { className } = props

  className = classNames (className, {
    "btn": true,
    "btn-round": round === true,
    "btn-text": round !== true,
    "btn-primary": primary,
    "btn-flat": flat,
    "autoWidth": autoWidth,
    "fullWidth": fullWidth,
    "disabled": isMaybe (disabled) ? Maybe.elem (true) (disabled) : disabled,
    "active": active,
  })

  return (
    <div {...other} className={className} onClick={disabled === true ? undefined : onClick}>
      {children}
    </div>
  )
}
