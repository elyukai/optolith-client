import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./VerticalList.scss"

type Props = {
  className?: string
}

/**
 * Displays a list of elements vertically, separated by dots.
 */
export const VerticalList: FCC<Props> = props => {
  const { children, className } = props

  return <div className={classList("vertical-list", className)}>{children}</div>
}
