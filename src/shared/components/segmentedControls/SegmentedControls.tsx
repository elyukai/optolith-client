import { FC } from "react"
import { Label } from "../label/Label.tsx"
import "./SegmentedControls.scss"
import { SegmentedControlsItem } from "./SegmentedControlsItem.tsx"

export type SegmentedOptionValue = string | number | undefined

export type SegmentedOption<A extends SegmentedOptionValue = SegmentedOptionValue> = {
  className?: string
  disabled?: boolean
  name: string
  value: A
}

type Props<A extends SegmentedOptionValue> = {
  active: A
  disabled?: boolean
  label?: string
  options: SegmentedOption<A>[]
  onClick(option: A): void
}

export const SegmentedControls = <A extends SegmentedOptionValue = SegmentedOptionValue>(
  props: Props<A>,
): ReturnType<FC<Props<A>>> => {
  const { active, disabled, label, onClick, options } = props

  return (
    <div className="segmented-controls">
      {label !== undefined && label !== "" ? <Label text={label} /> : null}
      <div className="segmented-controls-list">
        {options.map(option => (
          <SegmentedControlsItem
            key={option.value ?? "__default__"}
            active={active}
            disabled={disabled}
            onClick={onClick}
            option={option}
          />
        ))}
      </div>
    </div>
  )
}
