import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, Maybe, orN } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
  disabled?: boolean
  text?: string
}

export const Label: React.FC<Props> = props => {
  const { className, disabled, text } = props

  return (
    <label
      className={
        classListMaybe (List (
          Maybe (className),
          guardReplace (orN (disabled)) ("disabled")
        ))
      }
      >
      {text}
    </label>
  )
}
