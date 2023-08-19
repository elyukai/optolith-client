import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./Scroll.scss"

interface Props {
  className?: string
  noInnerElement?: boolean
  stable?: boolean
}

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
