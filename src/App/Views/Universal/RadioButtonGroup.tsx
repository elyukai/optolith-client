import * as React from "react";
import { equals } from "../../../Data/Eq";
import { List, map, toArray } from "../../../Data/List";
import { elem, fromJust, fromMaybe, isJust, Maybe, normalize, Nothing } from "../../../Data/Maybe";
import { fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator } from "../../../Data/Record";
import { pipe_ } from "../../Utilities/pipe";
import { RadioButton } from "./RadioButton";

export type OptionValue = string | number

export interface Option<A extends OptionValue = OptionValue> {
  "@@name": "Option"
  className: Maybe<string>
  disabled: Maybe<boolean>
  name: string
  value: Maybe<A>
}

export interface OptionCreator extends RecordCreator<Option<any>> {
  <O extends OptionValue = OptionValue>
  (x: PartialMaybeOrNothing<OmitName<Option<O>>>): Record<Option<O>>
}

export const Option: OptionCreator =
  fromDefault ("Option") <Option<any>> ({
                className: Nothing,
                disabled: Nothing,
                name: "",
                value: Nothing,
              })

export interface RadioButtonGroupProps<T extends OptionValue = OptionValue> {
  active: Maybe<T> | T
  array: List<Record<Option<T>>>
  disabled?: boolean
  onClick? (option: Maybe<T>): void
  onClickJust? (option: T): void
}

export function RadioButtonGroup<T extends OptionValue = OptionValue>
  (props: RadioButtonGroupProps<T>) {
    const { active, array: xs, disabled } = props

    const normalizedActive = normalize (active)

    const onClickCombined = (optionValue: Maybe<T>) => () => {
      if (props.onClick) {
        props.onClick (optionValue)
      }

      if (props.onClickJust && isJust (optionValue)) {
        props.onClickJust (fromJust (optionValue))
      }
    }

    return (
      <div className="radiobutton-group">
        {pipe_ (
          xs,
          map (e => (
            <RadioButton
              key={fromMaybe<React.Key> ("__default__") (Option.A.value (e))}
              value={Option.A.value (e)}
              active={equals (normalizedActive) (Option.A.value (e))}
              onClick={onClickCombined (Option.A.value (e))}
              disabled={elem (true) (Option.A.disabled (e)) || elem (true) (normalize (disabled))}
            >
              {Option.A.name (e)}
            </RadioButton>
          )),
          toArray
        )}
      </div>
    )
  }
