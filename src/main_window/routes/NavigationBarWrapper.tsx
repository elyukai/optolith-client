import { FCC } from "../../shared/utils/react.js"
import "./NavigationBarWrapper.scss"

/**
 * Returns a wrapper element for the complete navigation bar.
 */
export const NavigationBarWrapper: FCC = ({ children }) => (
  <div className="navigationbar">
    <div className="navigationbar-inner">{children}</div>
  </div>
)
