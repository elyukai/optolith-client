import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
  label: string
  max: number
  min: number
  onChange: () => void
  value: number
}

export const Slider: React.FC<Props> = props => {
  const { className, label, max, min, onChange, value } = props

  return (
    <div className={classListMaybe (List (Just ("slider"), Maybe (className)))}>
      <label>
        <span>{label}</span>
        <span>{value}</span>
      </label>
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={1}
        />
    </div>
  )
}
