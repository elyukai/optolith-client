import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"

type Width = "1/1" | "1/2" | "1/3" | "2/3"

type Props = {
  className?: string
  width?: Width
}

export const GridItem: FCC<Props> = ({ children, className, width = "1/1" }) => (
  <div className={classList("grid-item", className)} data-grid={width}>
    {children}
  </div>
)
