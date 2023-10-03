import { FCC } from "../../utils/react.ts"

/**
 * The left part of a list item.
 */
export const ListItemLeft: FCC = props => {
  const { children } = props

  return <div className="left">{children}</div>
}
