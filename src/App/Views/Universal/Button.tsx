import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just, Maybe, normalize, or, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

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

  const disabled_m = or (normalize (disabled))

  className = classListMaybe (List (
    Just ("btn"),
    Just (orN (round) ? "btn-round" : "btn-text"),
    guardReplace (orN (primary)) ("btn-primary"),
    guardReplace (orN (flat)) ("btn-flat"),
    guardReplace (orN (autoWidth)) ("autoWidth"),
    guardReplace (orN (fullWidth)) ("fullWidth"),
    guardReplace (disabled_m) ("disabled"),
    guardReplace (orN (active)) ("active")
  ))

  return (
    <div {...other} className={className} onClick={disabled_m ? undefined : onClick}>
      {children}
    </div>
  )
}
