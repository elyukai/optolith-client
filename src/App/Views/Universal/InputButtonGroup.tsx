import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

interface Props {
  className?: string
}

export const InputButtonGroup: React.FC<Props> = props => {
  const { className, children } = props

  return (
    <div className={classListMaybe (List (Just ("btn-group"), Maybe (className)))}>
      {children}
    </div>
  )
}
