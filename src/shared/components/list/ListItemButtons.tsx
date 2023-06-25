import { FCC } from "../../utils/react.ts"
import "./ListItemButtons.scss"

export const ListItemButtons: FCC = props => {
  const { children } = props

  return (
    <div className="li-btns">
      {children}
    </div>
  )
}
