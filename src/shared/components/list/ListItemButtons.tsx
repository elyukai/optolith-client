import { FCC } from "../../utils/react.ts"
import "./ListItemButtons.scss"

/**
 * A container for list item buttons.
 */
export const ListItemButtons: FCC = props => {
  const { children } = props

  return <div className="li-btns">{children}</div>
}
