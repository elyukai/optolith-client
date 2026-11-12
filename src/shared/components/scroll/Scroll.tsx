import { classList } from "@elyukai/utils/classList"
import type { FCC } from "../../utils/react.ts"
import "./Scroll.css"

interface Props {
  className?: string
  noInnerElement?: boolean
  stable?: boolean
}

/**
 * A scrollable area.
 */
export const Scroll: FCC<Props> = props => {
  const { className, children, noInnerElement, stable } = props

  return (
    <div className={classList("scroll", className)}>
      <div className={classList("scroll-area", { "scroll-area--stable": stable })}>
        {noInnerElement === true ? children : <div className="scroll-inner">{children}</div>}
      </div>
    </div>
  )
}
