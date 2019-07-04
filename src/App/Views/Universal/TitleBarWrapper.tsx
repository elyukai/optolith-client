import classNames from "classnames";
import * as React from "react";

export interface TitleBarWrapperProps {
  children?: React.ReactNode
  isFocused: boolean
}

export function TitleBarWrapper (props: TitleBarWrapperProps) {
  return (
    <div className={classNames ("titlebar", !props.isFocused ? "not-focused" : undefined)}>
      <div className="titlebar-inner">
        {props.children}
      </div>
    </div>
  )
}
