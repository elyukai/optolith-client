import * as React from "react";
import { classListMaybe } from "../../Utilities/CSS";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";

export interface InputButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function InputButtonGroup (props: InputButtonGroupProps) {
  const { className, children, ...other } = props

  return (
    <div className={classListMaybe (List (Just ("btn-group"), Maybe (className)))} {...other}>
      {children}
    </div>
  )
}
