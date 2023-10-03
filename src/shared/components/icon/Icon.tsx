import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.js"

interface Props {
  className?: string
  label: string
}

/**
 * An icon.
 */
export const Icon: FCC<Props> = props => {
  const { className, children, label } = props

  return (
    <div className={classList("icon", className)} aria-label={label}>
      {children}
    </div>
  )
}
