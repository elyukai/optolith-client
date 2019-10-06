import * as React from "react";
import { Markdown } from "./Markdown";
import { TooltipToggle } from "./TooltipToggle";

export interface TooltipHintProps {
  hint: string
  target: JSX.Element
  margin?: number
}

export const TooltipHint: React.FC<TooltipHintProps> = props => {
  const { hint, target, margin } = props

  return (
    <TooltipToggle
      content={<Markdown source={hint} />}
      small
      target={target}
      margin={margin}
      />
  )
}
