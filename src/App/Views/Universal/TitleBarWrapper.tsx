import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface TitleBarWrapperProps {
  isFocused: boolean
}

export const TitleBarWrapper: React.FC<TitleBarWrapperProps> = ({ isFocused, children }) => (
  <div
    className={
      classListMaybe (List (
        Just ("titlebar"),
        guardReplace (!isFocused) ("not-focused")
      ))
    }
    >
    <div className="titlebar-inner">
      {children}
    </div>
  </div>
)
