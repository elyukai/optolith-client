import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
}

export const VerticalList: React.FC<Props> = props => {
  const { children, className } = props

  return (
    <div className={classListMaybe (List (Just ("vertical-list"), Maybe (className)))}>
      {children}
    </div>
  )
}
