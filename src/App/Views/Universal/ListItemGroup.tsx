import * as React from "react";
import { isList, List, subscript } from "../../../Data/List";
import { fromMaybe, guardReplace, isJust, Just, Maybe, normalize, Nothing, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface ListItemGroupProps {
  children?: React.ReactNode
  index?: number | Maybe<number>
  list?: List<string>
  small?: boolean
  text?: string
}

export function ListItemGroup (props: ListItemGroupProps) {
  const { children, index, list, small, text } = props

  const normalizedIndex = normalize (index)

  const content =
    fromMaybe (children as any)
               (isJust (normalizedIndex) && isList (list)
                 ? subscript (list) (Maybe.fromJust (normalizedIndex) - 1)
                 : typeof text === "string"
                 ? Just (text)
                 : Nothing)

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
