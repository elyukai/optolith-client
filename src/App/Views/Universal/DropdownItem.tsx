import * as React from "react"
import { equals } from "../../../Data/Eq"
import { List } from "../../../Data/List"
import { fromMaybe, guardReplace, Maybe, or } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { DropdownKey, DropdownOption } from "../../Models/View/DropdownOption"
import { classListMaybe } from "../../Utilities/CSS"

const DOA = DropdownOption.A

interface Props<A extends DropdownKey> {
  active: Maybe<A>
  disabled: boolean
  option: Record<DropdownOption<A>>
  onChange (option: Maybe<A>): void
}

export const DropdownItem = <A extends DropdownKey> (props: Props<A>): React.ReactElement => {
  const { active, disabled, onChange, option } = props

  const classNameInner =
    classListMaybe (List (
      guardReplace (equals (active) (DOA.id (option))) ("active"),
      guardReplace (or (DOA.disabled (option))) ("disabled")
    ))

  const handleClick = React.useCallback (
    () => disabled || or (DOA.disabled (option)) ? undefined : onChange (DOA.id (option)),
    [ disabled, onChange, option ]
  )

  return (
    <div
      className={classNameInner}
      key={fromMaybe<string | number> ("__DEFAULT__") (DOA.id (option))}
      onClick={handleClick}
      >
      {DOA.name (option)}
    </div>
  )
}
