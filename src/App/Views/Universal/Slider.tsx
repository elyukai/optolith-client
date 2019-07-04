import classNames from "classnames";
import * as React from "react";

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
    <div className={classNames ("slider", className)}>
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
