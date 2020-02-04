import * as React from "react"
import { equals } from "../../../Data/Eq"
import { fromJust, isJust, Maybe, or, orN } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { RadioOption, RadioOptionValue as OptValue } from "../../Models/View/RadioOption"
import { Button } from "./Button"
import { Text } from "./Text"

const ROA = RadioOption.A

interface Props<A extends OptValue> {
  active: Maybe<A>
  option: Record<RadioOption<A>>
  disabled?: boolean
  onClick (option: Maybe<A>): void
  onClickJust? (option: A): void
}

export const SegmentedControlsItem = <A extends OptValue> (props: Props<A>): React.ReactElement => {
  const { active, option, disabled, onClick, onClickJust } = props

  const value = ROA.value (option) as Maybe<A>

  const handleClick = React.useCallback (
    () => {
      onClick (value)

      if (typeof onClickJust === "function" && isJust (value)) {
        onClickJust (fromJust (value))
      }
    },
    [ onClick, onClickJust, value ]
  )

  return (
    <Button
      active={equals (active) (value)}
      onClick={handleClick}
      disabled={or (ROA.disabled (option)) || orN (disabled)}
      autoWidth
      >
      <Text>{ROA.name (option)}</Text>
    </Button>
  )
}
