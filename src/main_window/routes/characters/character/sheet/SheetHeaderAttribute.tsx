import { classList } from "@elyukai/utils/classList"
import type { FC } from "react"
import "./SheetHeaderAttribute.css"

export type HeaderValue = {
  id: string
  label: string
  value?: number | string
  color?: string
  stretch?: number | boolean
}

export const SheetHeaderAttribute: FC<HeaderValue> = ({ label, value, color, stretch }) => (
  <div
    className={classList("sheet-attribute", color && `sheet-attribute--${color}`, {
      "sheet-attribute--stretch": stretch === true,
    })}
    style={
      { "--stretch": typeof stretch === "number" ? stretch : undefined } as React.CSSProperties
    }
  >
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
)
