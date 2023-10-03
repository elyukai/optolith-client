import { FCC } from "../../utils/react.ts"

/**
 * A wrapper for specific values displayed for the list item.
 */
export const ListItemValues: FCC = props => {
  const { children } = props

  return <div className="values">{children}</div>
}
