import * as React from "react";

export interface ListItemLeftProps {
  children?: React.ReactNode
}

export function ListItemLeft (props: ListItemLeftProps) {
  const { children } = props

  return (
    <div className="left">
      {children}
    </div>
  )
}
