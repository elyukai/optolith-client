import { FCC } from "../../utils/react.ts"

export const ListItemSelections: FCC = props => {
  const { children } = props

  return <div className="selections">{children}</div>
}
