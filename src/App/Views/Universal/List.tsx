import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface ListProps {
  children?: React.ReactNode
  className?: string
}

export function ListView (props: ListProps) {
  const { children, className } = props

  return (
    <ul className={classListMaybe (List (Just ("list-wrapper"), Maybe (className)))}>
      {children}
    </ul>
  )
}
