import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.js"

type Props = {
  secondary?: boolean
}

/**
 * The container for all titlebar elements.
 */
export const TitleBarWrapper: FCC<Props> = ({ children, secondary }) => (
  <div className={classList("titlebar", { "titlebar--secondary": secondary })}>
    <div className="titlebar-inner">{children}</div>
  </div>
)
