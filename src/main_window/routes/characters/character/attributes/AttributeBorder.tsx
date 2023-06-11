import { FC } from "react"
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

export const AttributeBorder: FC<Props> = props => {
  const { children, className, label, tooltip, tooltipMargin, value } = props

  const valueElement =
    tooltip === undefined
    ? (
      <div className="value">
        <div className="value-inner">
          <div>{value}</div>
        </div>
      </div>
    )
    : (
      <TooltipToggle
        content={tooltip}
        margin={tooltipMargin}
        target={
          <div className="value">
            <div className="value-inner">
              <div>{value}</div>
            </div>
          </div>
        }
        />
    )

  return (
    <div className={classList("attr", className)}>
      <div className="short">{label}</div>
      {valueElement}
      {children}
    </div>
  )
}
