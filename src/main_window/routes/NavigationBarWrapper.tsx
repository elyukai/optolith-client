import { FCC } from "../../shared/utils/react.js"
import "./NavigationBarWrapper.scss"

export const NavigationBarWrapper: FCC = ({ children }) => (
  <div className="navigationbar">
    <div className="navigationbar-inner">
      {children}
    </div>
  </div>
)
