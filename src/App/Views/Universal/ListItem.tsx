import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Maybe, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

interface Props {
  active?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  important?: boolean
  insertTopMargin?: boolean
  noIncrease?: boolean
  recommended?: boolean
  unrecommended?: boolean
  onClick? (): void
}

export const ListItem: React.FC<Props> = props => {
  const {
    active,
    children,
    className,
    disabled,
    important,
    insertTopMargin,
    noIncrease,
    recommended,
    unrecommended,
  } = props

  return (
    <li
      className={
        classListMaybe (List (
          Maybe (className),
          guardReplace (orN (active)) ("active"),
          guardReplace (orN (important)) ("imp"),
          guardReplace (orN (recommended)) ("typ"),
          guardReplace (orN (unrecommended)) ("untyp"),
          guardReplace (orN (noIncrease)) ("no-increase"),
          guardReplace (orN (insertTopMargin)) ("top-margin"),
          guardReplace (orN (disabled)) ("disabled")
        ))
      }
      >
      {orN (insertTopMargin) ? <div className="separator" /> : null}
      {children}
    </li>
  )
}
