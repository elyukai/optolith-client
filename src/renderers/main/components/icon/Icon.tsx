import { classList } from "../../../../shared/helpers/classList.ts"
import { FCC } from "../../../../shared/helpers/react.js"

interface Props {
  className?: string
  label: string
}

export const Icon: FCC<Props> = props => {
  const { className, children, label } = props

  return (
    <div className={classList("icon", className)} aria-label={label}>
      {children}
    </div>
  )
}
