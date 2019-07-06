import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface ListItemNameProps {
  addName?: Maybe<string>
  children?: React.ReactNode
  large?: boolean | JSX.Element
  name: string
}

export function ListItemName (props: ListItemNameProps) {
  const { addName: madd_name = Nothing, children, large, name } = props

  const titleElement = maybe (<p className="title">{name}</p>)
                             ((add_name: string) => (
                               <p className="title">
                                 <span>{name}</span>
                                 <span className="add">{add_name}</span>
                               </p>
                             ))
                             (madd_name)

  return (
    <div
      className={
        classListMaybe (List (
          Just ("name"),
          guardReplace (large !== undefined) ("large")
        ))
      }
      >
      {titleElement}
      {children}
    </div>
  )
}
