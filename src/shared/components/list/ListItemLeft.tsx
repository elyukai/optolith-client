import { FCC } from "../../utils/react.ts"

export const ListItemLeft: FCC = props => {
  const { children } = props

  return (
    <div className="left">
      {children}
    </div>
  )
}
