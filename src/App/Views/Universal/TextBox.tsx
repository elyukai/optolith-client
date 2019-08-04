import * as React from "react";
import { Textfit } from "react-textfit";
import { classListMaybe } from "../../Utilities/CSS";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";

export interface TextBoxProps {
  children?: React.ReactNode
  className?: string
  label: string
  value?: string | number
}

export const TextBox = (props: TextBoxProps) => {
  const { children, className, label, value } = props

  return (
    <div className={classListMaybe (List (Just ("textbox"), Maybe (className)))}>
      <h3>{label}</h3>
      {value !== undefined
        ? (
          <Textfit max={16} min={8} className="textbox-content">
            {value}
          </Textfit>
         )
         : children}
    </div>
  )
}
