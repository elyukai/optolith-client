import * as React from "react"
import { List, map, notNullStrUndef, toArray } from "../../../Data/List"
import { fromMaybe, Maybe, normalize } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { RadioOption, RadioOptionValue } from "../../Models/View/RadioOption"
import { pipe_ } from "../../Utilities/pipe"
import { Label } from "./Label"
import { SegmentedControlsItem } from "./SegmentedControlsItem"

const ROA = RadioOption.A

interface Props<A extends RadioOptionValue> {
  active: A | Maybe<A>
  disabled?: boolean
  label?: string
  options: List<Record<RadioOption<A>>>
  onClick (option: Maybe<A>): void
  onClickJust? (option: A): void
}

export const SegmentedControls = <A extends RadioOptionValue = RadioOptionValue>
  (props: Props<A>): React.ReactElement => {
  const { active, disabled, label, onClick, onClickJust, options } = props

  const normalizedActive = normalize (active)

  return (
    <div className="segmented-controls">
      {notNullStrUndef (label) ? <Label text={label} /> : null}
      <div className="segmented-controls-list">
        {
          pipe_ (
            options,
            map (option => (
              <SegmentedControlsItem
                key={fromMaybe<React.Key> ("__default__") (ROA.value (option) as Maybe<A>)}
                active={normalizedActive}
                disabled={disabled}
                onClick={onClick}
                onClickJust={onClickJust}
                option={option}
                />
            )),
            toArray
          )
        }
      </div>
    </div>
  )
}
