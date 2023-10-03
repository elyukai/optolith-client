import { useRef } from "react"
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import { TooltipHint } from "../tooltipHint/TooltipHint.tsx"

type Props = {
  className: string
  hint?: string
}

/**
 * A header element for a list.
 */
export const ListHeaderTag: FCC<Props> = props => {
  const { children, className, hint } = props

  const ref = useRef<HTMLDivElement>(null)

  if (typeof hint === "string") {
    return (
      <>
        <TooltipHint hint={hint} targetRef={ref} />
        <div className={classList("has-hint", className)} ref={ref}>
          {children}
        </div>
      </>
    )
  }

  return <div className={className}>{children}</div>
}
