import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./VerticalList.scss"

type Props = {
  className?: string
}

export const VerticalList: FCC<Props> = props => {
  const { children, className } = props

  return (
    <div className={classList("vertical-list", className)}>
      {children}
    </div>
  )
}
