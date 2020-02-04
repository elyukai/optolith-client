import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

interface Props {
  isFocused: boolean
}

export const TitleBarWrapper: React.FC<Props> = ({ isFocused, children }) => (
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
