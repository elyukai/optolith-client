import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, isJust, Just, Maybe, normalize, orN } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  group?: number | Maybe<number>
  getGroupName?: (group: number) => string
  small?: boolean
  text?: string
}

export const ListItemGroup: React.FC<Props> = props => {
  const { children, group, getGroupName, small, text } = props

  const normalizedGroup = normalize (group)

  const content = isJust (normalizedGroup) && typeof getGroupName === "function"
                  ? getGroupName (Maybe.fromJust (normalizedGroup))
                  : typeof text === "string"
                  ? text
                  : children

  return (
    <div
      className={
        classListMaybe (List (
          Just ("group"),
          guardReplace (orN (small)) ("small-info-text")
        ))
      }
      >
      {content}
    </div>
  )
}
