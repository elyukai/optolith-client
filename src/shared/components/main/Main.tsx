import { FCC } from "../../utils/react.ts"
import "./Main.scss"

export const Main: FCC = props => {
  const { children } = props

  return <main>{children}</main>
}
