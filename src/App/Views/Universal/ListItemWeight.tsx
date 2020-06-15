import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, Just, orN, Maybe, fromMaybe, isJust } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { ndash } from "../../Utilities/Chars.bs"

interface Props {
  weight: Maybe<number>
  small?: boolean
}

export const ListItemWeight: React.FC<Props> = props => {
  const { weight, small } = props

  const content = isJust (weight) ? (fromMaybe (-1) (weight)).toString () : ndash

  return (
    <div
      className={
        classListMaybe (List (
          Just ("weight"),
          guardReplace (orN (small)) ("small-info-text")
        ))
      }
      >
      {content}
    </div>
  )
}
