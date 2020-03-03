import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { TooltipToggle } from "../Universal/TooltipToggle"

export interface AttributeBorderProps {
  children?: React.ReactNode
  className?: string
  label?: string
  tooltip?: JSX.Element
  tooltipMargin?: number
  value: number | string
}

export const AttributeBorder: React.FC<AttributeBorderProps> = props => {
  const { children, className, label, tooltip, tooltipMargin, value } = props

  const valueElement =
    tooltip === undefined
    ? (
      <div className="value"><div className="value-inner"><div>{value}</div></div></div>
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
    <div className={classListMaybe (List (Just ("attr"), Maybe (className)))}>
      <div className="short">{label}</div>
      {valueElement}
      {children}
    </div>
  )
}
