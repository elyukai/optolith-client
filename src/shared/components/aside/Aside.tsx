import { FCC } from "../../utils/react.ts"
import "./Aside.scss"

type Props = {
  className?: string
}

/**
 * A side content area.
 */
export const Aside: FCC<Props> = ({ children, className }) => (
  <aside className={className}>{children}</aside>
)
