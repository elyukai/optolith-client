import * as React from "react";
import { equals } from "../../../Data/Eq";
import { List, map, notNullStrUndef, toArray } from "../../../Data/List";
import { fromJust, fromMaybe, isJust, Maybe, normalize, or, orN } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { pipe_ } from "../../Utilities/pipe";
import { Button } from "./Button";
import { Label } from "./Label";
import { Option, OptionValue } from "./RadioButtonGroup";
import { Text } from "./Text";

export { Option };

const OA = Option.A

export interface SegmentedControlsProps<T extends OptionValue> {
  active: T | Maybe<T>
  disabled?: boolean
  label?: string
  options: List<Record<Option<T>>>
  onClick (option: Maybe<T>): void
  onClickJust? (option: T): void
}

export function SegmentedControls<T extends OptionValue> (props: SegmentedControlsProps<T>) {
  const { active, disabled, label, onClick, onClickJust, options } = props

  const normalizedActive = normalize (active)

  return (
    <div className="segmented-controls">
      {notNullStrUndef (label) ? <Label text={label} /> : null}
      <div className="segmented-controls-list">
        {
          pipe_ (
            options,
            map (option => {
              const value = OA.value (option) as Maybe<T>

              return (
                <Button
                  key={
                    fromMaybe<React.Key> ("__default__") (value)
                  }
                  active={equals (normalizedActive) (value)}
                  onClick={() => {
                    onClick (value)

                    if (onClickJust && isJust (value)) {
                      onClickJust (fromJust (value))
                    }
                  }}
                  disabled={or (OA.disabled (option)) || orN (disabled)}
                  autoWidth
                >
                  <Text>{OA.name (option)}</Text>
                </Button>
              )
            }),
            toArray
          )
        }
      </div>
    </div>
  )
}
