import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./Scroll.scss"

interface Props {
  className?: string
  noInnerElement?: boolean
}

export const Scroll: FCC<Props> = props => {
  const { className, children, noInnerElement } = props

  return (
    <div className={classList("scroll", className)}>
      <div className="scroll-area">
        {noInnerElement === true ? children : <div className="scroll-inner">{children}</div>}
      </div>
    </div>
  )
}
