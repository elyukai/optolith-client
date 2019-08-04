import * as React from "react";
import { orN, Maybe, guardReplace } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { List } from "../../../Data/List";

export interface LabelProps {
  className?: string
  disabled?: boolean
  text?: string
}

export function Label (props: LabelProps) {
  const { className, disabled, text, ...other } = props

  return (
    <label
      {...other}
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
