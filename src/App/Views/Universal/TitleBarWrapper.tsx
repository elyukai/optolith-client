import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface TitleBarWrapperProps {
  children?: React.ReactNode
  isFocused: boolean
}

export function TitleBarWrapper (props: TitleBarWrapperProps) {
  return (
    <div
      className={
        classListMaybe (List (
          Just ("titlebar"),
          guardReplace (!props.isFocused) ("not-focused")
        ))
      }
      >
      <div className="titlebar-inner">
        {props.children}
      </div>
    </div>
  )
}
