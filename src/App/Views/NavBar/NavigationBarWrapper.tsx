import * as React from "react";

export interface NavigationBarWrapperProps {
  children?: React.ReactNode
}

export function NavigationBarWrapper (props: NavigationBarWrapperProps) {
  return (
    <div className="navigationbar">
      <div className="navigationbar-inner">
        {props.children}
      </div>
    </div>
  )
}
