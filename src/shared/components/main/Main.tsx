import type { FCC } from "../../utils/react.ts"
import "./Main.css"

type Props = {
  classOnly?: boolean
}

/**
 * The main content area.
 */
export const Main: FCC<Props> = props => {
  const { children, classOnly } = props

  return classOnly === true ? (
    <div className="main-content">{children}</div>
  ) : (
    <main>{children}</main>
  )
}
