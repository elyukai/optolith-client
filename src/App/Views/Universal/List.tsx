import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
}

export const ListView: React.FC<Props> = props => {
  const { children, className } = props

  return (
    <ul className={classListMaybe (List (Just ("list-wrapper"), Maybe (className)))}>
      {children}
    </ul>
  )
}
