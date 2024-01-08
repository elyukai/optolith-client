import { FCC } from "../../shared/utils/react.js"
import "./NavigationBarLeft.scss"

/**
 * Returns a grouping element for the left section of the navigation bar.
 */
export const NavigationBarLeft: FCC = ({ children }) => (
  <div className="navigationbar-left">{children}</div>
)
