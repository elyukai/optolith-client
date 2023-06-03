import { classList } from "../../../../shared/helpers/classList.ts"
import { FCC } from "../../../../shared/helpers/react.js"

type Props = {
  isFocused: boolean
}

export const TitleBarWrapper: FCC<Props> = ({ isFocused, children }) => (
  <div
    className={classList("titlebar", { "not-focused": !isFocused })}
    >
    <div className="titlebar-inner">
      {children}
    </div>
  </div>
)
