import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./InputButtonGroup.scss"

type Props = {
  className?: string
}

/**
 * A group of buttons.
 */
export const InputButtonGroup: FCC<Props> = props => {
  const { className, children } = props

  return <div className={classList("btn-group", className)}>{children}</div>
}
