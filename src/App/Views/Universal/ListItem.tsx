import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Maybe, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface ListItemProps {
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

export function ListItem (props: ListItemProps) {
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
    ...other
  } = props

  return (
    <li
      {...other}
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
      {orN (insertTopMargin) ? <div className="separator"></div> : null}
      {children}
    </li>
  )
}
