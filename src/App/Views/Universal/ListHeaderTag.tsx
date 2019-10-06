import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { TooltipHint } from "./TooltipHint";

export interface ListHeaderTagProps {
  children?: React.ReactNode
  className: string
  hint?: string
}

export function ListHeaderTag (props: ListHeaderTagProps) {
  const { children, className, hint } = props

  if (typeof hint === "string") {
    return (
      <TooltipHint
        hint={hint}
        target={
          <div className={classListMaybe (List (Just ("has-hint"), Maybe (className)))}>
            {children}
          </div>
        }
        />
    )
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}
