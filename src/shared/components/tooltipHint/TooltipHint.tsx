import { FC, RefObject } from "react"
import { Markdown } from "../markdown/Markdown.tsx"
import { TooltipToggle } from "../tooltipToggle/TooltipToggle.tsx"

type Props = {
  hint: string
  targetRef: RefObject<HTMLElement>
  margin?: number
}

export const TooltipHint: FC<Props> = props => {
  const { hint, targetRef, margin } = props

  return (
    <TooltipToggle
      content={<Markdown source={hint} />}
      small
      targetRef={targetRef}
      margin={margin}
      />
  )
}
