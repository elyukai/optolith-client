import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./Grid.scss"

type Size = "small" | "medium" | "large"

type Props = {
  size?: Size
}

export const Grid: FCC<Props> = ({ children, size = "medium" }) => (
  <div className={classList("grid", `grid--${size}`)}>{children}</div>
)
