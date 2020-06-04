import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  addName?: Maybe<string>
  children?: React.ReactNode
  large?: boolean | JSX.Element
  name: string
  onClick? (): void
}

export const ListItemName: React.FC<Props> = props => {
  const { addName: madd_name = Nothing, children, large, name, onClick } = props

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
      onClick={onClick}
      >
      {titleElement}
      {children}
    </div>
  )
}
