import * as classNames from "classnames";
import * as React from "react";
import { isList, List, subscript } from "../../../Data/List";
import { fromMaybeR, isJust, Just, Maybe, normalize, Nothing } from "../../../Data/Maybe";

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
    fromMaybeR (children)
               (isJust (normalizedIndex) && isList (list)
                 ? subscript (list) (Maybe.fromJust (normalizedIndex) - 1)
                 : typeof text === "string"
                 ? Just (text)
                 : Nothing)

  return (
    <div className={classNames ("group", small === true ? "small-info-text" : undefined)}>
      {content}
    </div>
  )
}
