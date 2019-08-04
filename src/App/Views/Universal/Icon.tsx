import * as React from "react";
import { classListMaybe } from "../../Utilities/CSS";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";

export interface IconProps {
  className?: string
  [id: string]: any
}

export function Icon (props: IconProps) {
  const { className, ...other } = props

  return (
    <div className={classListMaybe (List (Just ("icon"), Maybe (className)))} {...other} />
  )
}
