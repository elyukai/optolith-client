import { FCC } from "../../utils/react.ts"
import "./ListHeader.scss"

/**
 * A list header.
 */
export const ListHeader: FCC = props => {
  const { children } = props

  return <div className="list-header">{children}</div>
}
