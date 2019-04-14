import * as React from "react";

export interface ListItemSelectionsProps {
  children?: React.ReactNode
}

export function ListItemSelections (props: ListItemSelectionsProps) {
  const { children } = props

  return (
    <div className="selections">
      {children}
    </div>
  )
}
