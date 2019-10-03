import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just, Maybe, maybe, normalize, or, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { TooltipHint } from "./TooltipHint";

export interface ButtonProps {
  active?: boolean
  autoWidth?: boolean
  className?: string
  disabled?: boolean | Maybe<boolean>
  flat?: boolean
  fullWidth?: boolean
  hint?: Maybe<string>
  primary?: boolean
  round?: boolean
  onClick? (): void
}

export const Button: React.FC<ButtonProps> = props => {
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
    hint: mhint,
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

  const btnElement = (
    <div
      className={className}
      onClick={disabled_m ? undefined : onClick}
      >
      {children}
    </div>
  )

  return maybe (btnElement)
               ((hint: string) => (
                 <TooltipHint
                   hint={hint}
                   target={btnElement}
                   />
               ))
               (normalize (mhint))
}
