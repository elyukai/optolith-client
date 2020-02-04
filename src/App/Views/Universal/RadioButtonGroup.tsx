import * as React from "react"
import { equals } from "../../../Data/Eq"
import { List, map, toArray } from "../../../Data/List"
import { elem, fromJust, fromMaybe, isJust, Maybe, normalize } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { RadioOption, RadioOptionValue } from "../../Models/View/RadioOption"
import { pipe_ } from "../../Utilities/pipe"
import { RadioButton } from "./RadioButton"

const ROA = RadioOption.A

interface Props<A extends RadioOptionValue = RadioOptionValue> {
  active: Maybe<A> | A
  array: List<Record<RadioOption<A>>>
  disabled?: boolean
  onClick? (option: Maybe<A>): void
  onClickJust? (option: A): void
}

export const RadioButtonGroup = <A extends RadioOptionValue = RadioOptionValue>
  (props: Props<A>): React.ReactElement => {
    const { active, array: xs, disabled, onClick, onClickJust } = props

    const normalizedActive = normalize (active)

    const onClickCombined = (optionValue: Maybe<A>) => () => {
      if (typeof onClick === "function") {
        onClick (optionValue)
      }

      if (typeof onClickJust === "function" && isJust (optionValue)) {
        onClickJust (fromJust (optionValue))
      }
    }

    return (
      <div className="radiobutton-group">
        {pipe_ (
          xs,
          map (e => (
            <RadioButton
              key={fromMaybe<React.Key> ("__default__") (ROA.value (e))}
              value={ROA.value (e)}
              active={equals (normalizedActive) (ROA.value (e))}
              onClick={onClickCombined (ROA.value (e))}
              disabled={elem (true) (ROA.disabled (e)) || elem (true) (normalize (disabled))}
              >
              {ROA.name (e)}
            </RadioButton>
          )),
          toArray
        )}
      </div>
    )
  }
