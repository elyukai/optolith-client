import { classList } from "@elyukai/utils/classList"
import { deepEqual } from "@elyukai/utils/equality"
import { action } from "mobx"
import { observer } from "mobx-react-lite"
import { type FC, useCallback } from "react"

/**
 * Configuration for a dropdown option.
 */
export type DropdownOption<A> = {
  id: A
  name: string
  disabled?: boolean
}

type Props<A> = {
  active: DropdownOption<A>[]
  disabled: boolean
  option: DropdownOption<A>
  onChange: (option: A) => void
  equals?: (a: A, b: A) => boolean
}

/**
 * An item in the list of options of a dropdown.
 */
export const DropdownItem = observer(function DropdownItem<A>(
  props: Props<A>,
): ReturnType<FC<Props<A>>> {
  const { active, disabled, onChange, option, equals = deepEqual } = props

  const handleClick = useCallback(
    action(() => {
      if (!disabled && option.disabled !== true) {
        onChange(option.id)
      }
    }),
    [disabled, onChange, option],
  )

  return (
    <li
      className={classList({
        active: active.some(elem => equals(elem.id, option.id)),
        disabled: option.disabled === true,
      })}
      onClick={handleClick}
    >
      {option.name}
    </li>
  )
})
