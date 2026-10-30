import { classList } from "@elyukai/utils/classList"
import type { FCC } from "../../utils/react.ts"
import "./Grid.scss"

type Size = "small" | "medium" | "large"

type Props = {
  size?: Size
}

/**
 * A grid layout.
 */
export const Grid: FCC<Props> = ({ children, size = "medium" }) => (
  <div className={classList("grid", `grid--${size}`)}>{children}</div>
)
