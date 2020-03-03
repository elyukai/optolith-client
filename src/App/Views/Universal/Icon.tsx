import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
}

export const Icon: React.FC<Props> = props => {
  const { className, children } = props

  return (
    <div
      className={classListMaybe (List (Just ("icon"), Maybe (className)))}
      >
      {children}
    </div>
  )
}
