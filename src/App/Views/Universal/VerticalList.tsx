import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface VerticalListProps {
  className?: string
  children?: React.ReactNode
}

export function VerticalList (props: VerticalListProps) {
  const { children, className, ...other } = props

  return (
    <div {...other} className={classListMaybe (List (Just ("vertical-list"), Maybe (className)))}>
      {children}
    </div>
  )
}
