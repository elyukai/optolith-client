import { FC, useCallback } from "react"
import { Button } from "../button/Button.tsx"
import { SegmentedOption, SegmentedOptionValue } from "./SegmentedControls.tsx"

type Props<A extends SegmentedOptionValue> = {
  active: A
  option: SegmentedOption<A>
  disabled?: boolean
  onClick(option: A): void
}

export const SegmentedControlsItem = <A extends SegmentedOptionValue>(
  props: Props<A>,
): ReturnType<FC<Props<A>>> => {
  const { active, option, disabled, onClick } = props

  const handleClick = useCallback(() => {
    onClick(option.value)
  }, [onClick, option.value])

  return (
    <Button
      active={active === option.value}
      onClick={handleClick}
      disabled={option.disabled === true || disabled === true}
      autoWidth
    >
      {option.name}
    </Button>
  )
}
