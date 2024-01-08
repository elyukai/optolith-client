import { FCC } from "../../shared/utils/react.js"
import "./NavigationBarRight.scss"

/**
 * Returns a grouping element for the right section of the navigation bar.
 */
export const NavigationBarRight: FCC = ({ children }) => (
  <div className="navigationbar-right">{children}</div>
)
