import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./List.scss"

interface Props {
  className?: string
}

export const ListView: FCC<Props> = props => {
  const { children, className } = props

  return (
    <ul className={classList("list-wrapper", className)}>
      {children}
    </ul>
  )
}