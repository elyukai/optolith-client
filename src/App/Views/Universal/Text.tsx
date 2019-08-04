import * as React from "react";
import { classListMaybe } from "../../Utilities/CSS";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";

export interface TextProps {
  children?: React.ReactNode
  className?: string
  [id: string]: any
}

export function Text (props: TextProps) {
  const { children, className, ...other } = props

  return (
    <div {...other} className={classListMaybe (List (Just ("text"), Maybe (className)))}>
      {children}
    </div>
  )
}
