import { classList } from "@elyukai/utils/classList"
import { deepEqual } from "@elyukai/utils/equality"
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
  active: A
  disabled: boolean
  option: DropdownOption<A>
  onChange(option: A): void
  equals?(a: A, b: A): boolean
}

/**
 * An item in the list of options of a dropdown.
 */
export function DropdownItem<A>(props: Props<A>): ReturnType<FC<Props<A>>> {
  const { active, disabled, onChange, option, equals = deepEqual } = props

  const handleClick = useCallback(
    () => (disabled || option.disabled === true ? undefined : onChange(option.id)),
    [disabled, onChange, option],
  )

  return (
    <li
      className={classList({
        active: equals(option.id, active),
        disabled: option.disabled === true,
      })}
      onClick={handleClick}
    >
      {option.name}
    </li>
  )
}
