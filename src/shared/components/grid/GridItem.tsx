import { FCC } from "../../utils/react.ts"

type Width = "1/1" | "1/2" | "1/3" | "2/3"

type Props = {
  width?: Width
}

export const GridItem: FCC<Props> = ({ children, width = "1/1" }) => (
  <div className="grid-item" data-grid={width}>
    {children}
  </div>
)
