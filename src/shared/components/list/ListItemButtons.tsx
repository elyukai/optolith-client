import { FCC } from "../../utils/react.ts"

export const ListItemButtons: FCC = props => {
  const { children } = props

  return (
    <div className="btns">
      {children}
    </div>
  )
}
