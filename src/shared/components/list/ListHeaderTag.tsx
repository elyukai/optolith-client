
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"

interface Props {
  className: string
  hint?: string
}

export const ListHeaderTag: FCC<Props> = props => {
  const { children, className, hint } = props

  if (typeof hint === "string") {
    return (
      <TooltipHint
        hint={hint}
        target={
          <div className={classList("has-hint", className)}>
            {children}
          </div>
        }
        />
    )
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}
