import { FCC } from "../../utils/react.ts"
import "./Aside.scss"

type Props = {
  className?: string
}

export const Aside: FCC<Props> = ({ children, className }) => (
  <aside className={className}>
    {children}
  </aside>
)
