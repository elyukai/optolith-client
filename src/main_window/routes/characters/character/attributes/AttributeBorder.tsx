import { FC, useRef } from "react"
import { TooltipToggle } from "../../../../../shared/components/tooltipToggle/TooltipToggle.tsx"
import { classList } from "../../../../../shared/utils/classList.ts"

type Props = {
  children?: React.ReactNode
  className?: string
  label?: string
  tooltip?: JSX.Element
  tooltipMargin?: number
  value: number | string
}

/**
 * Returns an attribute value block.
 */
export const AttributeBorder: FC<Props> = props => {
  const { children, className, label, tooltip, tooltipMargin, value } = props

  const ref = useRef<HTMLDivElement>(null)

  const tooltipElement =
    tooltip === undefined ? undefined : (
      <TooltipToggle content={tooltip} margin={tooltipMargin} targetRef={ref} />
    )

  return (
    <div className={classList("attr", className)}>
      <div className="short">{label}</div>
      {tooltipElement}
      <div className="value" ref={ref}>
        <div className="value-inner">
          <div>{value}</div>
        </div>
      </div>
      {children}
    </div>
  )
}
