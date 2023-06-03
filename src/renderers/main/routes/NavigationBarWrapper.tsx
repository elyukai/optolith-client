import { FCC } from "../../../shared/helpers/react.js"
import "./NavigationBarWrapper.scss"

export const NavigationBarWrapper: FCC = ({ children }) => (
  <div className="navigationbar">
    <div className="navigationbar-inner">
      {children}
    </div>
  </div>
)
