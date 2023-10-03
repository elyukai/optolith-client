import { createPortal } from "react-dom"
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./Slidein.scss"

type Props = {
  className?: string
  isOpen: boolean
  close: () => void
}

/**
 * A slide-in panel over the main content.
 */
export const Slidein: FCC<Props> = props => {
  const { children, className, close, isOpen } = props

  return isOpen
    ? createPortal(
        <div className={classList("slidein-backdrop", className)}>
          <div className="slidein">
            <div className="slidein-close" onClick={close}>
              <div>{"\uE5CD"}</div>
            </div>
            <div className="slidein-content">{children}</div>
          </div>
        </div>,
        document.body,
      )
    : null
}
