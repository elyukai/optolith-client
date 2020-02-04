import * as React from "react"
import { Textfit } from "react-textfit"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
  label: string
  value?: string | number
}

export const TextBox: React.FC<Props> = props => {
  const { children, className, label, value } = props

  return (
    <div className={classListMaybe (List (Just ("textbox"), Maybe (className)))}>
      <h3>{label}</h3>
      {value === undefined
        ? children
        : (
          <Textfit max={16} min={8} className="textbox-content">
            {value}
          </Textfit>
         )}
    </div>
  )
}
