import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface TitleBarButtonProps {
  className?: string
  icon: string
  onClick (): void
}

export function TitleBarButton (props: TitleBarButtonProps) {
  return (
    <div
      className={classListMaybe (List (Just ("titlebar-btn"), Maybe (props.className)))}
      onClick={props.onClick}
      >
      <span>{props.icon}</span>
    </div>
  )
}
