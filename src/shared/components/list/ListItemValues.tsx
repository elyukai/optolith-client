import { FCC } from "../../utils/react.ts"

export const ListItemValues: FCC = props => {
  const { children } = props

  return <div className="values">{children}</div>
}
