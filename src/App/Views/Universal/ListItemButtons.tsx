import * as React from "react";

export interface ListItemButtonsProps {
  children?: React.ReactNode
}

export function ListItemButtons (props: ListItemButtonsProps) {
  const { children } = props

  return (
    <div className="btns">
      {children}
    </div>
  )
}
