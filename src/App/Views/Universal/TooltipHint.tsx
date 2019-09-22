import * as React from "react";
import { TooltipToggle } from "./TooltipToggle";

export interface TooltipHintProps {
  hint: string
  target: JSX.Element
}

export const TooltipHint: React.FC<TooltipHintProps> = props => {
  const { hint, target } = props

  return (
    <TooltipToggle
      content={hint}
      small
      target={target}
      />
  )
}
