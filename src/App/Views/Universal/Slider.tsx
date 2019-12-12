import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface SliderProps {
  className?: string
  label: string
  max: number
  min: number
  onChange: () => void
  value: number
}

export function Slider (props: SliderProps) {
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
