import { FCC } from "../../utils/react.ts"

/**
 * Wrapper for form elements to specify variable options for an entry.
 */
export const ListItemSelections: FCC = props => {
  const { children } = props

  return <div className="selections">{children}</div>
}
